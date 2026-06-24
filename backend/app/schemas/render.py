from pydantic import BaseModel
from enum import Enum


class RenderStatus(str, Enum):
    pending = "pending"
    rendering = "rendering"
    completed = "completed"
    failed = "failed"


class RenderTask(BaseModel):
    project_id: str
    output_format: str = "mp4"
    resolution: str = "1920x1080"
    fps: int = 30


class RenderProgress(BaseModel):
    status: RenderStatus
    progress: float = 0.0  # 0-100
    current_scene: int = 0
    total_scenes: int = 0
    message: str = ""
    output_url: str | None = None
