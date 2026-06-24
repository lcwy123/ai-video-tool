from io import BytesIO
from fastapi.testclient import TestClient


def test_upload_image(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    resp = client.post(
        f"/api/assets/upload/{proj['id']}",
        files={"file": ("test.png", BytesIO(b"fake-png"), "image/png")},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["asset_type"] == "image"
    assert data["file_name"] == "test.png"
    assert data["url"].startswith("/uploads/")


def test_list_assets(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    resp = client.get(f"/api/assets/project/{proj['id']}")
    assert resp.status_code == 200
    assert resp.json()["total"] >= 0


def test_delete_asset(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    up = client.post(
        f"/api/assets/upload/{proj['id']}",
        files={"file": ("del.png", BytesIO(b"fake"), "image/png")},
    ).json()
    resp = client.delete(f"/api/assets/{up['id']}")
    assert resp.status_code == 204
