import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.scene import Scene
from app.models.asset import Asset
from app.schemas.render import RenderProgress
from app.services.render_service import RenderService

router = APIRouter(prefix="/api/render", tags=["render"])
render_service = RenderService()


@router.post("/project/{project_id}")
async def start_render(project_id: uuid.UUID, db: Session = Depends(get_db)):
    scenes = db.query(Scene).filter(Scene.project_id == project_id).order_by(Scene.order).all()
    if not scenes:
        raise HTTPException(400, detail="Project has no scenes")

    scene_data = []
    for scene in scenes:
        bg_url = None
        vo_url = None
        if scene.background_id:
            bg = db.query(Asset).filter(Asset.id == scene.background_id).first()
            if bg:
                bg_url = bg.url
        if scene.voiceover_id:
            vo = db.query(Asset).filter(Asset.id == scene.voiceover_id).first()
            if vo:
                vo_url = vo.url
        scene_data.append({
            "script": scene.script,
            "duration": scene.duration,
            "background_url": bg_url,
            "voiceover_url": vo_url,
        })

    task_id = str(uuid.uuid4())
    from app.routes.ws import progress_store
    progress_store[task_id] = {"status": "pending", "progress": 0, "message": "准备渲染..."}

    async def cb(progress: dict):
        progress_store[task_id] = progress

    import asyncio
    asyncio.create_task(
        render_service.render_project(
            project_id=str(project_id), scenes=scene_data, progress_callback=cb,
        )
    )
    return {"task_id": task_id, "status": "pending"}


@router.get("/status/{task_id}", response_model=RenderProgress)
def get_render_status(task_id: str):
    from app.routes.ws import progress_store
    progress = progress_store.get(task_id)
    if not progress:
        raise HTTPException(404, detail="Task not found")
    return RenderProgress(**progress)
