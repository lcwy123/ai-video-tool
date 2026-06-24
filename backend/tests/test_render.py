from fastapi.testclient import TestClient


def test_render_empty_project(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Empty"}).json()
    resp = client.post(f"/api/render/project/{proj['id']}")
    assert resp.status_code == 400


def test_render_status_not_found(client: TestClient):
    resp = client.get("/api/render/status/nonexistent-id")
    assert resp.status_code == 404
