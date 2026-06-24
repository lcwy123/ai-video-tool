from app.providers.base_video import BaseVideoProvider, VideoResult


class StubVideoProvider(BaseVideoProvider):
    """Placeholder until a real video generation API is configured."""

    async def generate(self, prompt: str, **kwargs) -> VideoResult:
        return VideoResult(
            url="",
            duration_seconds=kwargs.get("duration", 5.0),
        )
