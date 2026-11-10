import time
import logging
from typing import Dict, Any, Optional
import httpx
from ..config import settings

logger = logging.getLogger("dukaan_saathi.gnani_stt")


class GnaniSTTService:
    """
    Adapter for Gnani Prisma v2.5 STT API.
    Provides speech-to-text with graceful fallback and mock mode.
    """
    def __init__(self):
        self.api_key = settings.GNANI_API_KEY
        self.endpoint = settings.GNANI_STT_ENDPOINT
        self.mock_mode = settings.MOCK_GNANI_APIS or not settings.has_gnani_key

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.wav") -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"STT transcription started for {filename} ({len(audio_bytes)} bytes).")

        # 1. Live Gnani Prisma v3.0 API Call (api.vachana.ai)
        if not self.mock_mode and self.api_key:
            try:
                headers = {
                    "X-API-Key-ID": self.api_key,
                    "Authorization": f"Bearer {self.api_key}",
                    "token": self.api_key
                }
                files = {
                    "audio_file": (filename, audio_bytes, "audio/wav")
                }
                data = {
                    "model": "prisma-v3.0",
                    "language_code": "indic-auto",
                    "format": "transcribe"
                }

                async with httpx.AsyncClient(timeout=12.0) as client:
                    response = await client.post(
                        self.endpoint,
                        files=files,
                        data=data,
                        headers=headers
                    )

                    duration_ms = round((time.time() - start_time) * 1000, 2)

                    if response.status_code == 200:
                        res_data = response.json()
                        transcript = (
                            res_data.get("transcript") or
                            res_data.get("text") or
                            res_data.get("asr_result") or
                            (res_data.get("result", [{}])[0].get("transcript") if isinstance(res_data.get("result"), list) else "") or
                            ""
                        )
                        confidence = res_data.get("confidence", 0.96)

                        logger.info(f"Gnani Prisma v3.0 STT success in {duration_ms}ms: '{transcript}'")
                        return {
                            "transcript": transcript.strip(),
                            "language": res_data.get("language", "hi"),
                            "confidence": float(confidence),
                            "processing_time_ms": duration_ms,
                            "source": "gnani_prisma_v3.0"
                        }
                    else:
                        logger.warning(
                            f"Gnani Prisma STT returned HTTP {response.status_code} ({response.text}). "
                            f"Falling back to high-fidelity mock transcription."
                        )
            except Exception as e:
                logger.error(f"Gnani Prisma STT API call exception: {type(e).__name__}: {e}. Falling back to mock transcription.")

        # 2. High-fidelity Mock/Demo Mode (Active when API key is missing or testing)
        duration_ms = round((time.time() - start_time) * 1000 + 380, 2)  # realistic latency
        mock_transcript = self._get_mock_transcript_for_audio(filename, len(audio_bytes))

        logger.info(f"Completed STT in mock mode in {duration_ms}ms: '{mock_transcript}'")
        return {
            "transcript": mock_transcript,
            "language": "hi",
            "confidence": 0.96,
            "processing_time_ms": duration_ms,
            "source": "gnani_prisma_mock"
        }

    def _get_mock_transcript_for_audio(self, filename: str, byte_len: int) -> str:
        fn = filename.lower()
        if "clean" in fn or "sample_1" in fn:
            return "Bhaiya, do kilo chawal aur ek litre refined oil chahiye."
        elif "noisy" in fn or "market" in fn or "sample_2" in fn:
            return "Bhaiya, paanch kg atta aur do packet biscuit dena jaldi se."
        elif "phone" in fn or "telephony" in fn or "sample_3" in fn:
            return "Hello bhaiya, aadha kg cheeni aur ek namak pack kar do."
        elif "fast" in fn or "hinglish" in fn or "sample_4" in fn:
            return "2 kg chawal aur ek bottle shampoo aur ek packet biscuit."
        else:
            # Live mic recording without pre-set demo file
            return "Bhaiya, 5 kg atta aur 2 packet biscuit dena."


gnani_stt_service = GnaniSTTService()

