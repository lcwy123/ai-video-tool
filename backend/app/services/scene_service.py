import uuid

from sqlalchemy.orm import Session

from app.models.scene import Scene
from app.schemas.scene import SceneCreate, SceneUpdate


class SceneService:
    def __init__(self, db: Session):
        self.db = db

    def list_by_project(self, project_id: uuid.UUID) -> list[Scene]:
        return (
            self.db.query(Scene)
            .filter(Scene.project_id == project_id)
            .order_by(Scene.order)
            .all()
        )

    def get(self, scene_id: uuid.UUID) -> Scene | None:
        return self.db.query(Scene).filter(Scene.id == scene_id).first()

    def create(self, data: SceneCreate) -> Scene:
        max_order = (
            self.db.query(Scene.order)
            .filter(Scene.project_id == data.project_id)
            .order_by(Scene.order.desc())
            .first()
        )
        next_order = (max_order[0] + 1) if max_order else 0
        scene = Scene(
            project_id=data.project_id,
            order=next_order,
            duration=data.duration,
            script=data.script,
            avatar_action=data.avatar_action,
        )
        self.db.add(scene)
        self.db.commit()
        self.db.refresh(scene)
        return scene

    def update(self, scene_id: uuid.UUID, data: SceneUpdate) -> Scene | None:
        scene = self.get(scene_id)
        if not scene:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(scene, key, value)
        self.db.commit()
        self.db.refresh(scene)
        return scene

    def reorder(self, scene_ids: list[uuid.UUID]) -> list[Scene]:
        scenes = self.db.query(Scene).filter(Scene.id.in_(scene_ids)).all()
        scene_map = {s.id: s for s in scenes}
        for idx, sid in enumerate(scene_ids):
            if sid in scene_map:
                scene_map[sid].order = idx
        self.db.commit()
        return sorted(scene_map.values(), key=lambda s: s.order)

    def delete(self, scene_id: uuid.UUID) -> bool:
        scene = self.get(scene_id)
        if not scene:
            return False
        self.db.delete(scene)
        self.db.commit()
        return True
