import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.models.asset import Asset


ALLOWED_TYPES = {
    "audio": [".mp3", ".wav", ".ogg", ".aac"],
    "image": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "video": [".mp4", ".mov", ".avi", ".webm"],
    "model_3d": [".glb", ".gltf", ".vrm"],
}


def _detect_asset_type(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    for atype, exts in ALLOWED_TYPES.items():
        if ext in exts:
            return atype
    return "image"


class AssetService:
    def __init__(self, db: Session):
        self.db = db

    def list_by_project(self, project_id: uuid.UUID) -> list[Asset]:
        return (
            self.db.query(Asset)
            .filter(Asset.project_id == project_id)
            .order_by(Asset.created_at.desc())
            .all()
        )

    def create_upload(self, project_id: uuid.UUID, file: UploadFile) -> Asset:
        upload_dir = Path(settings.upload_dir) / str(project_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        ext = Path(file.filename or "file").suffix
        filename = f"{uuid.uuid4()}{ext}"
        filepath = upload_dir / filename

        content = file.file.read()
        filepath.write_bytes(content)

        asset = Asset(
            project_id=project_id,
            asset_type=_detect_asset_type(file.filename or ""),
            url=f"/uploads/{project_id}/{filename}",
            file_size=len(content),
            source="uploaded",
            file_name=file.filename,
        )
        self.db.add(asset)
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def delete(self, asset_id: uuid.UUID) -> bool:
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            return False
        filepath = Path(settings.upload_dir) / str(asset.project_id) / Path(asset.url).name
        if filepath.exists():
            filepath.unlink()
        self.db.delete(asset)
        self.db.commit()
        return True
