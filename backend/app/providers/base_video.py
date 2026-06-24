from abc import ABC, abstractmethod


class VideoResult:
    def __init__(self, url: str, duration_seconds: float = 0):
        self.url = url
        self.duration_seconds = duration_seconds


class BaseVideoProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> VideoResult:
        ...
