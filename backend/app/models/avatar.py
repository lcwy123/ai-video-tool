import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Avatar(Base):
    __tablename__ = "avatars"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    portrait: Mapped[str | None] = mapped_column(String(500), nullable=True)
    model_3d_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    voice_preset: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON
    personality: Mapped[str] = mapped_column(Text, nullable=False, default="")
    avatar_style: Mapped[str] = mapped_column(String(20), nullable=False, default="写实")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow, onupdate=_utcnow, nullable=False)
