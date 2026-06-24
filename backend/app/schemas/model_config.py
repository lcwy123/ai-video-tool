from pydantic import BaseModel


class LLMConfig(BaseModel):
    provider: str = "openai"
    model: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 2048


class TTSConfig(BaseModel):
    provider: str = "edge_tts"
    voice_id: str = "zh-CN-XiaoxiaoNeural"
    speed: float = 1.0


class ImageGenConfig(BaseModel):
    provider: str = "openai"
    model: str = "dall-e-3"
    size: str = "1024x1024"


class VideoGenConfig(BaseModel):
    provider: str = "stub"
    model: str = "stub"


class ModelConfig(BaseModel):
    llm: LLMConfig = LLMConfig()
    tts: TTSConfig = TTSConfig()
    image_gen: ImageGenConfig = ImageGenConfig()
    video_gen: VideoGenConfig = VideoGenConfig()


class DefaultModelConfig(BaseModel):
    llm_providers: list[str] = ["openai", "anthropic", "ollama"]
    tts_providers: list[str] = ["edge_tts", "openai"]
    image_providers: list[str] = ["openai", "stable_diffusion"]
    video_providers: list[str] = ["stub", "runway"]
