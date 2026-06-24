from fastapi.testclient import TestClient


def test_create_avatar(client: TestClient):
    resp = client.post("/api/avatars", json={"name": "测试角色"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "测试角色"
    assert data["avatar_style"] == "写实"
    assert data["voice_preset"]["voice_id"] == "zh-CN-XiaoxiaoNeural"


def test_list_avatars(client: TestClient):
    resp = client.get("/api/avatars")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_get_avatar_not_found(client: TestClient):
    resp = client.get("/api/avatars/00000000-0000-0000-0000-000000000000")
    assert resp.status_code == 404


def test_update_avatar(client: TestClient):
    av = client.post("/api/avatars", json={"name": "旧名"}).json()
    resp = client.patch(f"/api/avatars/{av['id']}", json={"name": "新名", "personality": "开朗"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "新名"
    assert resp.json()["personality"] == "开朗"


def test_delete_avatar(client: TestClient):
    av = client.post("/api/avatars", json={"name": "待删除"}).json()
    resp = client.delete(f"/api/avatars/{av['id']}")
    assert resp.status_code == 204
