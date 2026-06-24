from app.routes.projects import router as projects_router
from app.routes.scenes import router as scenes_router
from app.routes.assets import router as assets_router
from app.routes.tts import router as tts_router
from app.routes.avatars import router as avatars_router
from app.routes.model_config import router as model_config_router

__all__ = [
    "projects_router", "scenes_router", "assets_router", "tts_router", "avatars_router",
    "model_config_router",
]
