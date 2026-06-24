import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.scene import SceneCreate, SceneReorder, SceneResponse, SceneUpdate
from app.services.scene_service import SceneService

router = APIRouter(prefix="/api/scenes", tags=["scenes"])


def get_service(db: Session = Depends(get_db)) -> SceneService:
    return SceneService(db)


@router.get("/project/{project_id}", response_model=list[SceneResponse])
def list_scenes(project_id: uuid.UUID, service: SceneService = Depends(get_service)):
    return service.list_by_project(project_id)


@router.post("", response_model=SceneResponse, status_code=201)
def create_scene(data: SceneCreate, service: SceneService = Depends(get_service)):
    return service.create(data)


@router.get("/{scene_id}", response_model=SceneResponse)
def get_scene(scene_id: uuid.UUID, service: SceneService = Depends(get_service)):
    scene = service.get(scene_id)
    if not scene:
        raise HTTPException(404, detail="Scene not found")
    return scene


@router.patch("/{scene_id}", response_model=SceneResponse)
def update_scene(
    scene_id: uuid.UUID, data: SceneUpdate, service: SceneService = Depends(get_service)
):
    scene = service.update(scene_id, data)
    if not scene:
        raise HTTPException(404, detail="Scene not found")
    return scene


@router.put("/reorder", response_model=list[SceneResponse])
def reorder_scenes(data: SceneReorder, service: SceneService = Depends(get_service)):
    scenes = service.reorder(data.scene_ids)
    if len(scenes) != len(data.scene_ids):
        raise HTTPException(400, detail="Some scene IDs not found")
    return scenes


@router.delete("/{scene_id}", status_code=204)
def delete_scene(scene_id: uuid.UUID, service: SceneService = Depends(get_service)):
    if not service.delete(scene_id):
        raise HTTPException(404, detail="Scene not found")
