from fastapi.testclient import TestClient


def test_generate_image_no_api_key(client: TestClient):
    """Without API key, OpenAI call should fail gracefully."""
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    resp = client.post("/api/generate/image", json={
        "project_id": proj["id"],
        "prompt": "a test image",
    })
    # Should return 502 since no API key is configured
    assert resp.status_code == 502


def test_generate_video(client: TestClient):
    """Video provider is stub, should still create an asset."""
    proj = client.post("/api/projects", json={"title": "Test"}).json()
    resp = client.post("/api/generate/video", json={
        "project_id": proj["id"],
        "prompt": "a test video",
        "duration": 5,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["asset_type"] == "video"
    assert data["source"] == "generated"
