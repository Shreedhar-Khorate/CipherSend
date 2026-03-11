from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ── Database record ────────────────────────────────────────────────────────────

class FileRecord(BaseModel):
    id: str
    file_name: str
    storage_path: str
    file_size: int
    hash_sha256: str
    password_hash: Optional[str] = None
    download_limit: int
    downloads: int
    expiry_time: datetime
    created_at: Optional[datetime] = None


# ── API request / response schemas ────────────────────────────────────────────

class UploadResponse(BaseModel):
    file_id: str
    share_link: str


class VerifyPasswordRequest(BaseModel):
    file_id: str
    password: str


class VerifyPasswordResponse(BaseModel):
    valid: bool


class HealthResponse(BaseModel):
    status: str
    service: str


class FileInfoResponse(BaseModel):
    file_id: str
    file_name: str
    file_size: int
    expiry_time: datetime
    password_protected: bool
    downloads: int
    download_limit: int
