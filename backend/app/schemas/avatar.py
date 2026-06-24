import json
import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator


class VoicePreset(BaseModel):
    provider: str = "edge_tts"
    voice_id: str = "zh-CN-XiaoxiaoNeural"
    speed: float = 1.0
    pitch: float = 1.0


class AvatarCreate(BaseModel):
    name: str
    personality: str = ""
    avatar_style: str = "写实"
    voice_preset: VoicePreset = VoicePreset()


class AvatarUpdate(BaseModel):
    name: str | None = None
    portrait: str | None = None
    model_3d_url: str | None = None
    voice_preset: VoicePreset | None = None
    personality: str | None = None
    avatar_style: str | None = None


class AvatarResponse(BaseModel):
    id: uuid.UUID
    name: str
    portrait: str | None
    model_3d_url: str | None
    voice_preset: dict | None
    personality: str
    avatar_style: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("voice_preset", mode="before")
    @classmethod
    def parse_voice_preset(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v
