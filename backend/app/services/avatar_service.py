import json
import uuid

from sqlalchemy.orm import Session

from app.models.avatar import Avatar
from app.schemas.avatar import AvatarCreate, AvatarUpdate


class AvatarService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Avatar]:
        return self.db.query(Avatar).order_by(Avatar.created_at.desc()).all()

    def get(self, avatar_id: uuid.UUID) -> Avatar | None:
        return self.db.query(Avatar).filter(Avatar.id == avatar_id).first()

    def create(self, data: AvatarCreate) -> Avatar:
        avatar = Avatar(
            name=data.name,
            personality=data.personality,
            avatar_style=data.avatar_style,
            voice_preset=data.voice_preset.model_dump_json(),
        )
        self.db.add(avatar)
        self.db.commit()
        self.db.refresh(avatar)
        return avatar

    def update(self, avatar_id: uuid.UUID, data: AvatarUpdate) -> Avatar | None:
        avatar = self.get(avatar_id)
        if not avatar:
            return None
        update_data = data.model_dump(exclude_unset=True, exclude={"voice_preset"})
        if data.voice_preset is not None:
            update_data["voice_preset"] = data.voice_preset.model_dump_json()
        for key, value in update_data.items():
            setattr(avatar, key, value)
        self.db.commit()
        self.db.refresh(avatar)
        return avatar

    def delete(self, avatar_id: uuid.UUID) -> bool:
        avatar = self.get(avatar_id)
        if not avatar:
            return False
        self.db.delete(avatar)
        self.db.commit()
        return True
