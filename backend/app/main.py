import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routes import projects_router, scenes_router, assets_router, tts_router

app = FastAPI(title="AI Video Tool API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(projects_router)
app.include_router(scenes_router)
app.include_router(assets_router)
app.include_router(tts_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
