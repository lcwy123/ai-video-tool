from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_project(client: TestClient):
    response = client.post("/api/projects", json={"title": "测试项目"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "测试项目"
    assert "id" in data
    assert data["scene_count"] == 0


def test_list_projects(client: TestClient):
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert "total" in data


def test_get_project_not_found(client: TestClient):
    response = client.get("/api/projects/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_create_and_get_project(client: TestClient):
    create_resp = client.post("/api/projects", json={"title": "集成测试"})
    assert create_resp.status_code == 201
    project_id = create_resp.json()["id"]

    get_resp = client.get(f"/api/projects/{project_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "集成测试"


def test_update_project(client: TestClient):
    create_resp = client.post("/api/projects", json={"title": "旧标题"})
    project_id = create_resp.json()["id"]

    update_resp = client.patch(f"/api/projects/{project_id}", json={"title": "新标题"})
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "新标题"


def test_delete_project(client: TestClient):
    create_resp = client.post("/api/projects", json={"title": "待删除"})
    project_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/projects/{project_id}")
    assert delete_resp.status_code == 204

    get_resp = client.get(f"/api/projects/{project_id}")
    assert get_resp.status_code == 404
