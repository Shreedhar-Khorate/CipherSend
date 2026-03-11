from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_key: str

    # Encryption
    aes_secret_key: str
    hash_algorithm: str = "SHA256"

    # Auth
    jwt_secret: str = "change_me_in_production"
    password_hash_scheme: str = "bcrypt"

    # File settings
    max_file_size_mb: int = 100
    default_expiry_hours: int = 24
    max_download_limit: int = 10

    # App
    app_name: str = "CipherSend API"
    environment: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
