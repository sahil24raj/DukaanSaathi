from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os
import tempfile


def get_default_database_url() -> str:
    """
    Determine safe database URL.
    In serverless environments (Vercel, AWS Lambda), the filesystem outside
    /tmp is read-only. We force SQLite to /tmp to prevent cold start crashes.
    """
    env_db = os.environ.get("DATABASE_URL")
    is_serverless = any(
        os.environ.get(k) for k in (
            "VERCEL", "VERCEL_ENV", "VERCEL_REGION",
            "AWS_LAMBDA_FUNCTION_NAME", "LAMBDA_TASK_ROOT", "NOW_REGION"
        )
    )
    
    if env_db and env_db.strip():
        # If running on serverless but user specified relative sqlite path, redirect to /tmp
        if is_serverless and "sqlite" in env_db and not env_db.startswith("sqlite:////tmp") and ":memory:" not in env_db:
            tmp_db = os.path.join(tempfile.gettempdir(), "dukaan_saathi.db").replace("\\", "/")
            return f"sqlite:///{tmp_db}"
        return env_db

    if is_serverless:
        tmp_db = os.path.join(tempfile.gettempdir(), "dukaan_saathi.db").replace("\\", "/")
        return f"sqlite:///{tmp_db}"

    return "sqlite:///./dukaan_saathi.db"


class Settings(BaseSettings):
    GNANI_API_KEY: Optional[str] = ""
    GNANI_STT_ENDPOINT: str = "https://api.gnani.ai/v2.5/stt"
    GNANI_TTS_ENDPOINT: str = "https://api.gnani.ai/v2.5/tts"
    
    EVON_API_KEY: Optional[str] = ""
    EVON_ENDPOINT: str = "https://api.gnani.ai/v3.3/evon"
    
    MOCK_GNANI_APIS: bool = False
    APP_ENV: str = "development"
    PORT: int = 8000
    DATABASE_URL: str = Field(default_factory=get_default_database_url)

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def has_gnani_key(self) -> bool:
        return bool(self.GNANI_API_KEY and self.GNANI_API_KEY.strip())

    @property
    def has_evon_key(self) -> bool:
        return bool(self.EVON_API_KEY and self.EVON_API_KEY.strip())


settings = Settings()

