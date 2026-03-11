import re
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.file_model import FileInfoResponse
from app.services.file_service import download_file, get_file_info

router = APIRouter()
_limiter = Limiter(key_func=get_remote_address)

_UUID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


def _validate_file_id(file_id: str) -> None:
    if not _UUID_RE.match(file_id):
        raise HTTPException(status_code=400, detail="Invalid file ID format")


@router.get(
    "/files/{file_id}",
    response_model=FileInfoResponse,
    summary="Get file metadata (no binary data)",
)
async def file_info(file_id: str):
    """Return public metadata for a file so the frontend can render the download page."""
    _validate_file_id(file_id)
    record = get_file_info(file_id)
    return FileInfoResponse(
        file_id=record["id"],
        file_name=record["file_name"],
        file_size=record["file_size"],
        expiry_time=record["expiry_time"],
        password_protected=bool(record.get("password_hash")),
        downloads=record["downloads"],
        download_limit=record["download_limit"],
    )


@router.get(
    "/download/{file_id}",
    summary="Decrypt and download a file",
    responses={
        200: {"content": {"application/octet-stream": {}}},
        401: {"description": "Missing or incorrect password"},
        403: {"description": "Download limit reached"},
        404: {"description": "File not found"},
        410: {"description": "File has expired"},
        422: {"description": "Integrity check failed"},
    },
)
@_limiter.limit("30/minute")
async def download_endpoint(
    request: Request,
    file_id: str,
    x_file_password: Optional[str] = Header(
        None,
        alias="X-File-Password",
        description="Plain-text password (sent over HTTPS only)",
    ),
):
    """
    Validate the file, decrypt it, verify its SHA-256 hash, and stream it back
    as an `application/octet-stream` download.

    Pass the optional file password via the **`X-File-Password`** request header.
    """
    _validate_file_id(file_id)
    filename, file_bytes = download_file(file_id, x_file_password)
    return Response(
        content=file_bytes,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(file_bytes)),
        },
    )
