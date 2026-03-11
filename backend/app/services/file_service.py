import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple

from fastapi import HTTPException
from supabase import create_client

from app.core.config import get_settings
from app.core.encryption import decrypt_file, encrypt_file
from app.core.security import hash_password, verify_password
from app.services.hash_service import hash_file, verify_hash
from app.services.storage_service import download_encrypted_file, upload_encrypted_file


# ── Supabase DB helper ────────────────────────────────────────────────────────

def _db():
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_key)


# ── Internal helpers ──────────────────────────────────────────────────────────

def _get_record(file_id: str) -> dict:
    """Fetch the file metadata row; raises 404 if not found."""
    resp = _db().table("files").select("*").eq("id", file_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="File not found")
    return resp.data[0]


def _check_expiry(record: dict) -> None:
    expiry = datetime.fromisoformat(record["expiry_time"])
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expiry:
        raise HTTPException(status_code=410, detail="This file has expired")


def _check_download_limit(record: dict) -> None:
    if record["downloads"] >= record["download_limit"]:
        raise HTTPException(
            status_code=403, detail="Download limit reached for this file"
        )


def _check_password(record: dict, password: Optional[str]) -> None:
    if record.get("password_hash"):
        if not password:
            raise HTTPException(
                status_code=401, detail="A password is required to access this file"
            )
        if not verify_password(password, record["password_hash"]):
            raise HTTPException(status_code=401, detail="Incorrect password")


# ── Public service functions ──────────────────────────────────────────────────

def upload_file(
    file_bytes: bytes,
    filename: str,
    password: Optional[str],
    expiry_hours: Optional[int],
    download_limit: Optional[int],
) -> str:
    """
    Full upload pipeline:
    1. Validate file size
    2. Compute SHA-256
    3. AES-256-GCM encrypt
    4. Store encrypted blob in Supabase Storage
    5. Persist metadata row in Supabase DB
    Returns the new file UUID.
    """
    settings = get_settings()

    # 1 – Size guard
    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds the {settings.max_file_size_mb} MB limit",
        )

    # 2 – Identifiers
    file_id = str(uuid.uuid4())
    storage_path = f"encrypted_{file_id}.bin"

    # 3 – Integrity hash (over plaintext)
    sha256 = hash_file(file_bytes)

    # 4 – Encrypt
    encrypted = encrypt_file(file_bytes)

    # 5 – Upload to Supabase Storage
    upload_encrypted_file(storage_path, encrypted)

    # 6 – Prepare metadata
    pw_hash = hash_password(password) if password else None
    hours = expiry_hours if expiry_hours is not None else settings.default_expiry_hours
    limit = download_limit if download_limit is not None else settings.max_download_limit
    expiry_time = datetime.now(timezone.utc) + timedelta(hours=hours)

    # 7 – Persist
    _db().table("files").insert(
        {
            "id": file_id,
            "file_name": filename,
            "storage_path": storage_path,
            "file_size": len(file_bytes),
            "hash_sha256": sha256,
            "password_hash": pw_hash,
            "download_limit": limit,
            "downloads": 0,
            "expiry_time": expiry_time.isoformat(),
        }
    ).execute()

    return file_id


def download_file(file_id: str, password: Optional[str]) -> Tuple[str, bytes]:
    """
    Full download pipeline:
    1. Fetch metadata
    2. Validate expiry, limit, password
    3. Download encrypted blob
    4. Decrypt
    5. Verify SHA-256 integrity
    6. Increment download counter
    Returns (filename, plaintext_bytes).
    """
    record = _get_record(file_id)

    _check_expiry(record)
    _check_download_limit(record)
    _check_password(record, password)

    # Download + decrypt
    encrypted_bytes = download_encrypted_file(record["storage_path"])

    try:
        file_bytes = decrypt_file(encrypted_bytes)
    except Exception:
        raise HTTPException(
            status_code=500, detail="Decryption failed — file may be corrupted"
        )

    # Integrity check
    if not verify_hash(file_bytes, record["hash_sha256"]):
        raise HTTPException(
            status_code=422,
            detail="File integrity check failed — SHA-256 mismatch",
        )

    # Increment counter
    _db().table("files").update(
        {"downloads": record["downloads"] + 1}
    ).eq("id", file_id).execute()

    return record["file_name"], file_bytes


def get_file_info(file_id: str) -> dict:
    """Return public metadata for a file (no binary data)."""
    record = _get_record(file_id)
    _check_expiry(record)
    _check_download_limit(record)
    return record


def check_file_password(file_id: str, password: str) -> bool:
    """
    Return True if *password* is correct for the file, or if the file has
    no password protection.
    """
    record = _get_record(file_id)
    if not record.get("password_hash"):
        return True
    return verify_password(password, record["password_hash"])
