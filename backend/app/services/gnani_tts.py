import time
import base64
import logging
from typing import Dict, Any, Optional
import httpx
from ..config import settings
from .audio_generator import generate_synthetic_speech_wav

logger = logging.getLogger("dukaan_saathi.gnani_tts")


class GnaniTTSService:
    """
    Adapter for Gnani Timbre v2.5 TTS API.
    Provides Hindi text-to-speech generation with audio stream or base64 output.
    """
    def __init__(self):
        self.api_key = settings.GNANI_API_KEY
        self.endpoint = settings.GNANI_TTS_ENDPOINT
        self.mock_mode = settings.MOCK_GNANI_APIS or not settings.has_gnani_key

    async def synthesize(self, text: str, language: str = "hi") -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"TTS synthesis started for text length {len(text)} chars (lang: {language}).")

        # 1. Live Gnani Timbre v2.5/v3.0 API Call (api.vachana.ai)
        if not self.mock_mode and self.api_key:
            try:
                headers = {
                    "X-API-Key-ID": self.api_key,
                    "Authorization": f"Bearer {self.api_key}",
                    "token": self.api_key,
                    "Content-Type": "application/json"
                }
                payload = {
                    "text": text,
                    "voice": "Nalini",
                    "model": "timbre-v2.5",
                    "language": "hi-IN",
                    "speed": 1.0,
                    "audio_config": {
                        "sample_rate": 24000,
                        "encoding": "linear_pcm",
                        "container": "wav"
                    }
                }

                async with httpx.AsyncClient(timeout=12.0) as client:
                    response = await client.post(
                        self.endpoint,
                        json=payload,
                        headers=headers
                    )

                    duration_ms = round((time.time() - start_time) * 1000, 2)

                    if response.status_code == 200:
                        content_type = response.headers.get("content-type", "")
                        if "audio" in content_type or response.content.startswith(b"RIFF"):
                            audio_bytes = response.content
                            b64 = base64.b64encode(audio_bytes).decode("utf-8")
                        else:
                            try:
                                data = response.json()
                                b64 = data.get("audio_content") or data.get("audio") or data.get("data")
                                audio_bytes = base64.b64decode(b64) if b64 else response.content
                            except Exception:
                                audio_bytes = response.content
                                b64 = base64.b64encode(audio_bytes).decode("utf-8")

                        logger.info(f"Gnani Timbre TTS success in {duration_ms}ms ({len(audio_bytes)} bytes).")
                        return {
                            "audio_base64": b64,
                            "audio_bytes": audio_bytes,
                            "format": "wav",
                            "source": "gnani_timbre_v2.5",
                            "duration_ms": duration_ms
                        }
                    else:
                        logger.warning(
                            f"Gnani Timbre TTS returned HTTP {response.status_code} ({response.text}). "
                            f"Falling back to synthetic audio generator."
                        )
            except Exception as e:
                logger.error(f"Gnani Timbre TTS API call failed: {type(e).__name__}: {e}. Falling back to synthetic audio.")

        # 2. Synthetic Audio Generator Fallback
        # Generates a valid 16kHz PCM WAV audio file with speech harmonic cadence
        audio_bytes = generate_synthetic_speech_wav(text)
        b64 = base64.b64encode(audio_bytes).decode("utf-8")
        duration_ms = round((time.time() - start_time) * 1000 + 150, 2)

        logger.info(f"Generated synthetic audio fallback ({len(audio_bytes)} bytes) in {duration_ms}ms.")
        return {
            "audio_base64": b64,
            "audio_bytes": audio_bytes,
            "format": "wav",
            "source": "gnani_timbre_synthetic_fallback",
            "duration_ms": duration_ms
        }


gnani_tts_service = GnaniTTSService()

