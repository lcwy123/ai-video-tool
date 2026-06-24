import edge_tts
from app.providers.base_tts import BaseTTSProvider, TTSResult


class EdgeTTSProvider(BaseTTSProvider):
    def __init__(self):
        self._default_voice = "zh-CN-XiaoxiaoNeural"

    async def synthesize(self, text: str, voice: str = "", speed: float = 1.0) -> TTSResult:
        voice_id = voice or self._default_voice
        rate = f"+{int((speed - 1) * 100)}%" if speed >= 1 else f"{int((1 - speed) * 100)}%"
        communicate = edge_tts.Communicate(text, voice=voice_id, rate=rate)
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
        estimated_duration = max(len(audio_data) / 16000, 1.0)
        return TTSResult(audio_data=audio_data, duration_seconds=estimated_duration)
