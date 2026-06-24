from fastapi.testclient import TestClient


def test_create_scene(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    resp = client.post("/api/scenes", json={"project_id": proj["id"], "script": "Hello"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["script"] == "Hello"
    assert data["order"] == 0


def test_list_scenes(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    client.post("/api/scenes", json={"project_id": proj["id"], "script": "S1"})
    client.post("/api/scenes", json={"project_id": proj["id"], "script": "S2"})
    resp = client.get(f"/api/scenes/project/{proj['id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    assert data[0]["order"] == 0
    assert data[1]["order"] == 1


def test_update_scene(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    scene = client.post("/api/scenes", json={"project_id": proj["id"]}).json()
    resp = client.patch(f"/api/scenes/{scene['id']}", json={"script": "Updated"})
    assert resp.status_code == 200
    assert resp.json()["script"] == "Updated"


def test_reorder_scenes(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    s1 = client.post("/api/scenes", json={"project_id": proj["id"]}).json()
    s2 = client.post("/api/scenes", json={"project_id": proj["id"]}).json()
    resp = client.put("/api/scenes/reorder", json={"scene_ids": [s2["id"], s1["id"]]})
    assert resp.status_code == 200
    result = resp.json()
    assert result[0]["id"] == s2["id"]
    assert result[0]["order"] == 0


def test_delete_scene(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    scene = client.post("/api/scenes", json={"project_id": proj["id"]}).json()
    resp = client.delete(f"/api/scenes/{scene['id']}")
    assert resp.status_code == 204
    assert client.get(f"/api/scenes/{scene['id']}").status_code == 404
