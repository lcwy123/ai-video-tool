import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.model_config import DefaultModelConfig, ModelConfig

router = APIRouter(prefix="/api/model-config", tags=["model_config"])


@router.get("/default", response_model=DefaultModelConfig)
def get_default_config():
    return DefaultModelConfig()


@router.get("/project/{project_id}", response_model=ModelConfig | None)
def get_project_config(project_id: uuid.UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.model_config:
        return None
    return json.loads(project.model_config)


@router.put("/project/{project_id}")
def update_project_config(project_id: uuid.UUID, config: ModelConfig, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(404, detail="Project not found")
    project.model_config = config.model_dump_json()
    db.commit()
    return {"status": "ok"}
