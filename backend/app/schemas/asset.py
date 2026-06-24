import uuid
from datetime import datetime

from pydantic import BaseModel


class AssetResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    asset_type: str
    url: str
    thumbnail: str | None
    file_size: int | None
    source: str
    file_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class AssetListResponse(BaseModel):
    assets: list[AssetResponse]
    total: int
