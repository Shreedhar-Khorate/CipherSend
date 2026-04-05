from fastapi import APIRouter, Request

from app.models.file_model import VerifyPasswordRequest, VerifyPasswordResponse
from app.services.file_service import check_file_password
from app.services.log_service import log_activity

router = APIRouter()


@router.post(
    "/verify-password",
    response_model=VerifyPasswordResponse,
    summary="Verify a file's password",
)
async def verify_password_endpoint(body: VerifyPasswordRequest, request: Request):
    """
    Check whether the supplied *password* is correct for the given *file_id*.

    Returns `{"valid": true}` or `{"valid": false}`.  
    Does **not** reveal whether the file is password-protected at all.
    """
    valid = check_file_password(body.file_id, body.password)
    
    # Log password verification attempts
    log_activity(
        file_id=body.file_id,
        event_type='download',  # Password check is part of download flow
        status='success' if valid else 'failed',
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get('user-agent', 'unknown'),
        attempt_count=1
    )
    
    return VerifyPasswordResponse(valid=valid)
