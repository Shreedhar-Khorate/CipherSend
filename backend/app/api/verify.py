from fastapi import APIRouter

from app.models.file_model import VerifyPasswordRequest, VerifyPasswordResponse
from app.services.file_service import check_file_password

router = APIRouter()


@router.post(
    "/verify-password",
    response_model=VerifyPasswordResponse,
    summary="Verify a file's password",
)
async def verify_password_endpoint(body: VerifyPasswordRequest):
    """
    Check whether the supplied *password* is correct for the given *file_id*.

    Returns `{"valid": true}` or `{"valid": false}`.  
    Does **not** reveal whether the file is password-protected at all.
    """
    valid = check_file_password(body.file_id, body.password)
    return VerifyPasswordResponse(valid=valid)
