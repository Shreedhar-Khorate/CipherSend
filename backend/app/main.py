from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api import download, health, upload, verify, files
from app.core.config import get_settings

# ── Startup / shutdown ────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Future: initialise DB pool, background cleanup task, etc.
    yield


# ── Rate limiter ──────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

# ── App factory ───────────────────────────────────────────────────────────────

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "CipherSend — secure file transfer API. "
        "Files are AES-256-GCM encrypted and SHA-256 verified."
    ),
    version="1.0.0",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────

_ALLOWED_ORIGINS = [
    "http://localhost:5173",       # Vite dev server
    "http://localhost:3000",
    "https://ciphersend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# ── Global error handler ──────────────────────────────────────────────────────

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Do not leak internal details in production
    if settings.environment == "development":
        detail = str(exc)
    else:
        detail = "An internal error occurred"
    return JSONResponse(status_code=500, content={"detail": detail})

# ── Routers ───────────────────────────────────────────────────────────────────

PREFIX = "/api/v1"

app.include_router(health.router,   prefix=PREFIX, tags=["Health"])
app.include_router(upload.router,   prefix=PREFIX, tags=["Upload"])
app.include_router(download.router, prefix=PREFIX, tags=["Download"])
app.include_router(verify.router,   prefix=PREFIX, tags=["Verify"])
app.include_router(files.router,    prefix=PREFIX, tags=["Files"])
