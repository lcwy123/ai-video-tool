from fastapi.testclient import TestClient


def test_get_default_config(client: TestClient):
    resp = client.get("/api/model-config/default")
    assert resp.status_code == 200
    data = resp.json()
    assert "llm_providers" in data


def test_update_project_config(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    config = {
        "llm": {"provider": "openai", "model": "gpt-4", "temperature": 0.5, "max_tokens": 1024},
        "tts": {"provider": "edge_tts", "voice_id": "zh-CN-YunxiNeural", "speed": 1.2},
        "image_gen": {"provider": "openai", "model": "dall-e-3", "size": "1024x1024"},
        "video_gen": {"provider": "stub", "model": "stub"},
    }
    resp = client.put(f"/api/model-config/project/{proj['id']}", json=config)
    assert resp.status_code == 200


def test_get_project_config(client: TestClient):
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    resp = client.get(f"/api/model-config/project/{proj['id']}")
    assert resp.status_code == 200
