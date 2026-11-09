from fastapi import APIRouter, UploadFile, File, Depends, Response, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import base64
from ..database import get_db
from ..schemas import (
    TranscribeResponse,
    ParseOrderRequest,
    ParsedOrderResponse,
    SpeakRequest,
    SpeakResponse
)
from ..services.gnani_stt import gnani_stt_service
from ..services.gnani_tts import gnani_tts_service
from ..services.order_parser import OrderParserService
from ..services.catalog import CatalogService
from ..services.audio_generator import generate_sample_wav_variant

router = APIRouter(prefix="/api", tags=["voice"])

order_parser = OrderParserService()

DEMO_SAMPLES = [
    {
        "id": "clean_hindi",
        "title": "Clean Hindi Order",
        "title_hi": "स्पष्ट हिंदी आर्डर",
        "description": "Clear kirana order with standard quantities and products.",
        "sample_text": "Bhaiya, do kilo chawal aur ek litre refined oil chahiye.",
        "audio_url": "/api/demo-samples/clean_hindi/audio",
        "category": "Clean Studio Audio",
        "expected_items": [
            {"product": "Chawal", "qty": 2, "unit": "kg"},
            {"product": "Refined Oil", "qty": 1, "unit": "litre"}
        ]
    },
    {
        "id": "noisy_market",
        "title": "Noisy Market Kirana",
        "title_hi": "शोर-शराबे वाला बाजार",
        "description": "Real-world noisy Indian bazaar background with crowd chatter.",
        "sample_text": "Bhaiya, paanch kg atta aur do packet biscuit dena jaldi se.",
        "audio_url": "/api/demo-samples/noisy_market/audio",
        "category": "High Ambient Noise",
        "expected_items": [
            {"product": "Atta", "qty": 5, "unit": "kg"},
            {"product": "Biscuit", "qty": 2, "unit": "packet"}
        ]
    },
    {
        "id": "phone_call",
        "title": "Phone Call / Telephony",
        "title_hi": "फ़ोन कॉल स्टाइल",
        "description": "Bandpass filtered 8kHz telephony audio common in tele-orders.",
        "sample_text": "Hello bhaiya, aadha kg cheeni aur ek namak pack kar do.",
        "audio_url": "/api/demo-samples/phone_call/audio",
        "category": "Telephony Audio",
        "expected_items": [
            {"product": "Sugar", "qty": 0.5, "unit": "kg"},
            {"product": "Salt", "qty": 1, "unit": "kg"}
        ]
    },
    {
        "id": "fast_hinglish",
        "title": "Fast Hinglish Order",
        "title_hi": "तेज़ हिंग्लिश आर्डर",
        "description": "Mixed Hindi-English colloquial speech with rapid cadence.",
        "sample_text": "2 kg chawal aur ek bottle shampoo aur ek packet biscuit.",
        "audio_url": "/api/demo-samples/fast_hinglish/audio",
        "category": "Fast Mixed Dialect",
        "expected_items": [
            {"product": "Chawal", "qty": 2, "unit": "kg"},
            {"product": "Shampoo", "qty": 1, "unit": "bottle"},
            {"product": "Biscuit", "qty": 1, "unit": "packet"}
        ]
    }
]


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Accepts WAV or audio file, sends to Gnani Prisma v2.5 STT,
    and returns transcript, detected language, confidence, and processing time.
    """
    audio_bytes = await file.read()
    result = await gnani_stt_service.transcribe(audio_bytes, filename=file.filename or "recording.wav")
    return TranscribeResponse(
        transcript=result["transcript"],
        language=result["language"],
        confidence=result.get("confidence", 0.95),
        processing_time_ms=result["processing_time_ms"],
        source=result["source"]
    )


@router.post("/parse-order", response_model=ParsedOrderResponse)
async def parse_order(request: ParseOrderRequest, db: Session = Depends(get_db)):
    """
    Takes Hindi/Hinglish transcript text, extracts items, checks local catalog stock,
    computes totals, and prepares a natural Hindi confirmation response.
    """
    catalog_service = CatalogService(db)

    # 1. Parse text using Evon LLM or fallback rules
    raw_items, parse_method = await order_parser.parse_order(request.transcript)

    # 2. Match products in catalog, calculate totals and stock
    parsed_items, unknown_items, total = catalog_service.check_stock_and_build_items(raw_items)

    # 3. Determine order status
    status = "ready_for_confirmation"
    if not parsed_items and unknown_items:
        status = "unknown_items_only"
    elif not parsed_items:
        status = "empty"
    elif any(not it.in_stock for it in parsed_items):
        status = "stock_issue"

    # 4. Generate natural Hindi spoken confirmation
    hindi_reply = catalog_service.generate_hindi_confirmation(parsed_items, total)

    return ParsedOrderResponse(
        items=parsed_items,
        total=total,
        status=status,
        unknown_items=unknown_items,
        hindi_reply=hindi_reply,
        transcript=request.transcript,
        parse_method=parse_method,
        confidence=0.96 if parse_method == "evon_llm" else 0.92
    )


@router.post("/speak", response_model=SpeakResponse)
async def speak_text(request: SpeakRequest):
    """
    Synthesizes Hindi response text into speech using Gnani Timbre v2.5.
    Returns base64 audio and metadata.
    """
    result = await gnani_tts_service.synthesize(request.text, language=request.language or "hi")
    return SpeakResponse(
        audio_base64=result["audio_base64"],
        audio_url=f"/api/speak/stream?text={request.text}",
        format="wav",
        source=result["source"],
        duration_estimate_sec=round(result["duration_ms"] / 1000.0, 2)
    )


@router.get("/speak/stream")
async def stream_spoken_audio(text: str = Query(..., description="Text to speak in Hindi")):
    """
    Direct audio stream endpoint for HTML5 <audio> playback.
    """
    result = await gnani_tts_service.synthesize(text, language="hi")
    audio_bytes = result.get("audio_bytes")
    if not audio_bytes and result.get("audio_base64"):
        audio_bytes = base64.b64decode(result["audio_base64"])
    return Response(content=audio_bytes, media_type="audio/wav")


@router.get("/demo-samples")
def get_demo_samples():
    """Returns the 4 curated demo test cases for noise/telephony simulation."""
    return DEMO_SAMPLES


@router.get("/demo-samples/{sample_id}/audio")
def get_sample_audio_file(sample_id: str):
    """Generates and streams the sample WAV file for the requested demo variant."""
    audio_data = generate_sample_wav_variant(sample_id)
    return Response(
        content=audio_data,
        media_type="audio/wav",
        headers={"Content-Disposition": f"inline; filename={sample_id}.wav"}
    )

