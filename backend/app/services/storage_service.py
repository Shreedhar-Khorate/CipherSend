from supabase import create_client, Client

from app.core.config import get_settings

BUCKET_NAME = "encrypted-files"


def _client() -> Client:
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_key)


def upload_encrypted_file(storage_path: str, data: bytes) -> None:
    """Upload *data* to the Supabase storage bucket at *storage_path*."""
    _client().storage.from_(BUCKET_NAME).upload(
        storage_path,
        data,
        {"content-type": "application/octet-stream"},
    )


def download_encrypted_file(storage_path: str) -> bytes:
    """Download and return the raw bytes stored at *storage_path*."""
    return _client().storage.from_(BUCKET_NAME).download(storage_path)


def delete_encrypted_file(storage_path: str) -> None:
    """Remove *storage_path* from the bucket (used for cleanup / expiry)."""
    _client().storage.from_(BUCKET_NAME).remove([storage_path])
