import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.asset import AssetListResponse, AssetResponse
from app.services.asset_service import AssetService

router = APIRouter(prefix="/api/assets", tags=["assets"])


def get_service(db: Session = Depends(get_db)) -> AssetService:
    return AssetService(db)


@router.get("/project/{project_id}", response_model=AssetListResponse)
def list_assets(project_id: uuid.UUID, service: AssetService = Depends(get_service)):
    assets = service.list_by_project(project_id)
    return AssetListResponse(
        assets=[AssetResponse.model_validate(a) for a in assets],
        total=len(assets),
    )


@router.post("/upload/{project_id}", response_model=AssetResponse, status_code=201)
def upload_asset(
    project_id: uuid.UUID,
    file: UploadFile = File(...),
    service: AssetService = Depends(get_service),
):
    return service.create_upload(project_id, file)


@router.delete("/{asset_id}", status_code=204)
def delete_asset(asset_id: uuid.UUID, service: AssetService = Depends(get_service)):
    if not service.delete(asset_id):
        raise HTTPException(404, detail="Asset not found")
