import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.asset import Asset
from app.providers.openai_image import OpenAIImageProvider
from app.providers.stub_video import StubVideoProvider
from app.schemas.asset import AssetResponse

router = APIRouter(prefix="/api/generate", tags=["generate"])
image_provider = OpenAIImageProvider()
video_provider = StubVideoProvider()


class ImageGenRequest(BaseModel):
    project_id: uuid.UUID
    prompt: str
    style: str = "自然"


class VideoGenRequest(BaseModel):
    project_id: uuid.UUID
    prompt: str
    duration: int = 5


@router.post("/image", response_model=AssetResponse)
async def generate_image(req: ImageGenRequest, db: Session = Depends(get_db)):
    try:
        result = await image_provider.generate(req.prompt)
    except Exception as e:
        raise HTTPException(502, detail=f"Image generation failed: {e}")

    asset = Asset(
        project_id=req.project_id,
        asset_type="image",
        url=result.url,
        source="generated",
        file_name=f"ai_{uuid.uuid4()}.png",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return AssetResponse.model_validate(asset)


@router.post("/video", response_model=AssetResponse)
async def generate_video(req: VideoGenRequest, db: Session = Depends(get_db)):
    try:
        result = await video_provider.generate(req.prompt, duration=req.duration)
    except Exception as e:
        raise HTTPException(502, detail=f"Video generation failed: {e}")

    asset = Asset(
        project_id=req.project_id,
        asset_type="video",
        url=result.url,
        source="generated",
        file_name=f"ai_{uuid.uuid4()}.mp4",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return AssetResponse.model_validate(asset)
