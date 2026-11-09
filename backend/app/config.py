from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os


class Settings(BaseSettings):
    GNANI_API_KEY: Optional[str] = ""
    GNANI_STT_ENDPOINT: str = "https://api.gnani.ai/v2.5/stt"
    GNANI_TTS_ENDPOINT: str = "https://api.gnani.ai/v2.5/tts"
    
    EVON_API_KEY: Optional[str] = ""
    EVON_ENDPOINT: str = "https://api.gnani.ai/v3.3/evon"
    
    MOCK_GNANI_APIS: bool = False
    APP_ENV: str = "development"
    PORT: int = 8000
    DATABASE_URL: str = "sqlite:////tmp/dukaan_saathi.db" if os.environ.get("VERCEL") else "sqlite:///./dukaan_saathi.db"

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

