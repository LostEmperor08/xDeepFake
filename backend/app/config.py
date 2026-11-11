"""Application Configuration using Pydantic Settings."""

from functools import lru_cache
from pathlib import Path
from typing import List, Set
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for DEEPFAKE X Forensic API."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application Metadata
    APP_NAME: str = "DEEPFAKE X Forensic API"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Server Networking
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # File Upload & Safety Limits
    MAX_UPLOAD_SIZE_MB: int = 50
    UPLOAD_DIR: Path = Path("temp/uploads")
    ALLOWED_EXTENSIONS: Set[str] = {
        # Images
        "jpg",
        "jpeg",
        "png",
        "webp",
        # Video
        "mp4",
        "avi",
        "mov",
        "mkv",
        # Audio
        "wav",
        "mp3",
        "flac",
        # Document
        "pdf",
    }

    # Logging
    LOG_LEVEL: str = "INFO"

    @property
    def max_upload_size_bytes(self) -> int:
        """Returns maximum upload size in bytes."""
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@lru_cache()
def get_settings() -> Settings:
    """Returns cached application settings instance."""
    return Settings()
