import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.asset import Asset
from app.providers.edge_tts_provider import EdgeTTSProvider
from app.schemas.asset import AssetResponse

router = APIRouter(prefix="/api/tts", tags=["tts"])

_provider = EdgeTTSProvider()


@router.post("/synthesize")
async def synthesize(
    text: str,
    project_id: uuid.UUID,
    voice: str = "",
    db: Session = Depends(get_db),
):
    result = await _provider.synthesize(text, voice=voice)
    asset = Asset(
        project_id=project_id,
        asset_type="audio",
        url=f"tts://{project_id}/{uuid.uuid4()}.mp3",
        file_size=len(result.audio_data),
        source="generated",
        file_name=f"tts_{uuid.uuid4()}.mp3",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return {
        "asset": AssetResponse.model_validate(asset),
        "duration_seconds": result.duration_seconds,
    }
