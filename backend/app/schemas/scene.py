import uuid
from datetime import datetime

from pydantic import BaseModel


class SceneCreate(BaseModel):
    project_id: uuid.UUID
    script: str = ""
    duration: int = 10
    avatar_action: str = ""


class SceneUpdate(BaseModel):
    script: str | None = None
    duration: int | None = None
    order: int | None = None
    voiceover_id: uuid.UUID | None = None
    background_id: uuid.UUID | None = None
    avatar_action: str | None = None


class SceneReorder(BaseModel):
    scene_ids: list[uuid.UUID]


class SceneResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    order: int
    duration: int
    script: str
    voiceover_id: uuid.UUID | None
    background_id: uuid.UUID | None
    avatar_action: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
