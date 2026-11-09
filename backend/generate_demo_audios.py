import os
import sys

sys.path.append(os.path.dirname(__file__))

from app.services.audio_generator import generate_sample_wav_variant

DEMO_DIR = os.path.join(os.path.dirname(__file__), "demo_audio")
os.makedirs(DEMO_DIR, exist_ok=True)

files = [
    ("clean_hindi_order.wav", "clean_hindi"),
    ("noisy_market_order.wav", "noisy_market"),
    ("phone_call_order.wav", "phone_call"),
    ("fast_hinglish_order.wav", "fast_hinglish")
]

for filename, variant in files:
    path = os.path.join(DEMO_DIR, filename)
    audio_data = generate_sample_wav_variant(variant)
    with open(path, "wb") as f:
        f.write(audio_data)
    print(f"Generated {filename} ({len(audio_data)} bytes)")
print("All demo audio files generated successfully.")

