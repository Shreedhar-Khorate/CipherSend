from typing import Optional

from fastapi import APIRouter, File, Form, Request, UploadFile
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.file_model import UploadResponse
from app.services.file_service import upload_file

router = APIRouter()
_limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Upload and encrypt a file",
)
@_limiter.limit("20/minute")
async def upload_endpoint(
    request: Request,  # required by slowapi
    file: UploadFile = File(..., description="The file to encrypt and store"),
    password: Optional[str] = Form(
        None, description="Optional password to protect the file"
    ),
    expiry_hours: Optional[int] = Form(
        None, description="Hours until the link expires (default: 24)"
    ),
    download_limit: Optional[int] = Form(
        None, description="Maximum download count (default: 10)"
    ),
):
    """
    Upload a file.  
    The file is SHA-256 hashed, AES-256-GCM encrypted, stored in Supabase
    Storage, and its metadata is persisted in the database.

    Returns the `file_id` and a `share_link` the frontend can use to build
    the share page URL.
    """
    file_bytes = await file.read()
    file_id = upload_file(
        file_bytes=file_bytes,
        filename=file.filename or "unnamed",
        password=password,
        expiry_hours=expiry_hours,
        download_limit=download_limit,
    )
    return UploadResponse(file_id=file_id, share_link=f"/share/{file_id}")
