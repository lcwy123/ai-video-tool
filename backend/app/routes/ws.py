from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()
progress_store: dict[str, dict] = {}


@router.websocket("/ws/render/{task_id}")
async def render_websocket(websocket: WebSocket, task_id: str):
    await websocket.accept()
    try:
        import asyncio

        while True:
            progress = progress_store.get(task_id)
            if progress:
                await websocket.send_json(progress)
                if progress.get("status") in ("completed", "failed"):
                    break
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass
