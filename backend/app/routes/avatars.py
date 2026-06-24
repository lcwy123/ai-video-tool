import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.avatar import AvatarCreate, AvatarResponse, AvatarUpdate
from app.services.avatar_service import AvatarService

router = APIRouter(prefix="/api/avatars", tags=["avatars"])


def get_service(db: Session = Depends(get_db)) -> AvatarService:
    return AvatarService(db)


@router.get("", response_model=list[AvatarResponse])
def list_avatars(service: AvatarService = Depends(get_service)):
    return service.list_all()


@router.post("", response_model=AvatarResponse, status_code=201)
def create_avatar(data: AvatarCreate, service: AvatarService = Depends(get_service)):
    return service.create(data)


@router.get("/{avatar_id}", response_model=AvatarResponse)
def get_avatar(avatar_id: uuid.UUID, service: AvatarService = Depends(get_service)):
    avatar = service.get(avatar_id)
    if not avatar:
        raise HTTPException(404, detail="Avatar not found")
    return avatar


@router.patch("/{avatar_id}", response_model=AvatarResponse)
def update_avatar(
    avatar_id: uuid.UUID, data: AvatarUpdate, service: AvatarService = Depends(get_service)
):
    avatar = service.update(avatar_id, data)
    if not avatar:
        raise HTTPException(404, detail="Avatar not found")
    return avatar


@router.delete("/{avatar_id}", status_code=204)
def delete_avatar(avatar_id: uuid.UUID, service: AvatarService = Depends(get_service)):
    if not service.delete(avatar_id):
        raise HTTPException(404, detail="Avatar not found")
