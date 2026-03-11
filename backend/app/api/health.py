from fastapi import APIRouter

from app.models.file_model import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check():
    """Returns 200 OK when the API is running."""
    return HealthResponse(status="ok", service="CipherSend API")
