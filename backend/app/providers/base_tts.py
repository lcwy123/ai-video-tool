from abc import ABC, abstractmethod


class TTSResult:
    def __init__(self, audio_data: bytes, duration_seconds: float, format: str = "mp3"):
        self.audio_data = audio_data
        self.duration_seconds = duration_seconds
        self.format = format


class BaseTTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str, voice: str = "", speed: float = 1.0) -> TTSResult:
        ...
