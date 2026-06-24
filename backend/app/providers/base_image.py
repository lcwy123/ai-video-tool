from abc import ABC, abstractmethod


class ImageResult:
    def __init__(self, url: str, revised_prompt: str | None = None):
        self.url = url
        self.revised_prompt = revised_prompt


class BaseImageProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> ImageResult:
        ...
