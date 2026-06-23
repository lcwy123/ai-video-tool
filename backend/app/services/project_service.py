import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, db: Session):
        self.db = db

    def list_projects(self) -> list[Project]:
        return self.db.query(Project).order_by(Project.updated_at.desc()).all()

    def get_project(self, project_id: uuid.UUID) -> Project | None:
        return self.db.query(Project).filter(Project.id == project_id).first()

    def create_project(self, data: ProjectCreate) -> Project:
        project = Project(title=data.title)
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update_project(self, project_id: uuid.UUID, data: ProjectUpdate) -> Project | None:
        project = self.get_project(project_id)
        if not project:
            return None
        if data.title is not None:
            project.title = data.title
        self.db.commit()
        self.db.refresh(project)
        return project

    def delete_project(self, project_id: uuid.UUID) -> bool:
        project = self.get_project(project_id)
        if not project:
            return False
        self.db.delete(project)
        self.db.commit()
        return True
