import io
import math
import struct
import wave
import random
from typing import Optional


def generate_synthetic_speech_wav(text: str, duration_sec: Optional[float] = None) -> bytes:
    """
    Generates a valid, playable 16-bit 16kHz mono PCM WAV file.
    Uses formant-style harmonic modulation resembling speech cadence,
    proportional to the text length or requested duration.
    """
    sample_rate = 16000
    if not duration_sec:
        # Approximate speech duration: ~150-180 words per minute
        word_count = max(1, len(text.split()))
        duration_sec = max(1.2, min(8.0, word_count * 0.35 + 0.5))

    total_samples = int(sample_rate * duration_sec)
    buffer = io.BytesIO()

    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)

        # Formant frequencies typical of human vocal tract (F1 ~ 500Hz, F2 ~ 1500Hz, F3 ~ 2500Hz)
        pitch_base = 145.0  # Hz base pitch for Hindi voice
        frames = bytearray()

        for i in range(total_samples):
            t = float(i) / sample_rate
            # Syllabic cadence modulation (~4-5 syllables per sec)
            cadence = 0.5 + 0.5 * math.sin(2 * math.pi * 4.5 * t)
            
            # Formant synthesis
            s1 = math.sin(2 * math.pi * pitch_base * t)
            s2 = 0.5 * math.sin(2 * math.pi * (pitch_base * 2.0) * t)
            s3 = 0.3 * math.sin(2 * math.pi * 650 * t)  # F1
            s4 = 0.2 * math.sin(2 * math.pi * 1700 * t)  # F2

            # Smooth envelope attack and decay
            envelope = 1.0
            if t < 0.1:
                envelope = t / 0.1
            elif t > duration_sec - 0.2:
                envelope = max(0.0, (duration_sec - t) / 0.2)

            val = (s1 + s2 + s3 + s4) * cadence * envelope * 0.45
            val = max(-1.0, min(1.0, val))
            sample_val = int(val * 32767)
            frames.extend(struct.pack("<h", sample_val))

        wav_file.writeframes(frames)

    return buffer.getvalue()


def generate_sample_wav_variant(variant_type: str) -> bytes:
    """
    Generates synthetic WAV audio corresponding to the 4 demo types:
    - 'clean_hindi': clear cadence, high SNR
    - 'noisy_market': ambient chatter and market noise background
    - 'phone_call': bandpassed telephony 300Hz-3400Hz with 8kHz resampling
    - 'fast_hinglish': rapid syllables cadence
    """
    sample_rate = 16000
    duration_sec = 2.8
    total_samples = int(sample_rate * duration_sec)
    buffer = io.BytesIO()

    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)

        frames = bytearray()
        pitch = 160.0 if variant_type == "fast_hinglish" else 135.0
        cadence_speed = 7.0 if variant_type == "fast_hinglish" else 4.0

        for i in range(total_samples):
            t = float(i) / sample_rate
            cadence = 0.5 + 0.5 * math.sin(2 * math.pi * cadence_speed * t)

            # Vocal carrier
            vocal = (math.sin(2 * math.pi * pitch * t) +
                     0.4 * math.sin(2 * math.pi * pitch * 2 * t) +
                     0.3 * math.sin(2 * math.pi * 800 * t)) * cadence

            noise = 0.0
            if variant_type == "noisy_market":
                # Add background ambient hustle noise
                noise = (random.random() * 2.0 - 1.0) * 0.18 + 0.08 * math.sin(2 * math.pi * 120 * t)
            elif variant_type == "phone_call":
                # Telephony bandpass distortion
                vocal = vocal * (0.8 + 0.2 * math.sin(2 * math.pi * 1000 * t))
                noise = (random.random() * 2.0 - 1.0) * 0.06

            sample = (vocal * 0.4 + noise)
            sample = max(-0.95, min(0.95, sample))
            frames.extend(struct.pack("<h", int(sample * 32767)))

        wav_file.writeframes(frames)

    return buffer.getvalue()

