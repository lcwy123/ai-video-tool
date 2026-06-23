import uuid
from datetime import datetime

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str


class ProjectUpdate(BaseModel):
    title: str | None = None


class ProjectResponse(BaseModel):
    id: uuid.UUID
    title: str
    scene_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    projects: list[ProjectResponse]
    total: int
