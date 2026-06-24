from openai import AsyncOpenAI

from app.config import settings
from app.providers.base_image import BaseImageProvider, ImageResult


class OpenAIImageProvider(BaseImageProvider):
    def __init__(self):
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._default_model = "dall-e-3"

    async def generate(self, prompt: str, **kwargs) -> ImageResult:
        model = kwargs.get("model", self._default_model)
        response = await self._client.images.generate(
            model=model,
            prompt=prompt,
            size=kwargs.get("size", "1024x1024"),
            n=1,
        )
        data = response.data[0]
        return ImageResult(url=data.url or "", revised_prompt=data.revised_prompt)
