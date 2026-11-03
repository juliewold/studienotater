#!/usr/bin/env python3
# Speaks phrases with a Piper voice and writes them to one mono WAV file, with silence after
# each phrase. Called by lecture-audio.mjs with --provider piper.
#
#   echo '[{"text": "Hei.", "pause": 340}]' | python3 scripts/piper-speak.py <model.onnx> <out.wav>

import io
import json
import sys
import wave

from piper import PiperVoice

model, out = sys.argv[1], sys.argv[2]
phrases = json.load(sys.stdin)
voice = PiperVoice.load(model)
rate = voice.config.sample_rate
frames = bytearray()

for phrase in phrases:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as writer:
        voice.synthesize_wav(phrase["text"], writer)
    buffer.seek(0)
    with wave.open(buffer, "rb") as reader:
        frames += reader.readframes(reader.getnframes())
    frames += b"\x00\x00" * int(rate * phrase["pause"] / 1000)

with wave.open(out, "wb") as writer:
    writer.setnchannels(1)
    writer.setsampwidth(2)
    writer.setframerate(rate)
    writer.writeframes(bytes(frames))
