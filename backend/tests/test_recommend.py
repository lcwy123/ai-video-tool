from fastapi.testclient import TestClient


def test_recommend_short_script(client: TestClient):
    resp = client.post("/api/recommend/from-script", json={
        "script": "hello world",
        "style": "写实",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["suggested_background"]
    assert data["suggested_duration"] >= 5


def test_recommend_with_mood_keyword(client: TestClient):
    resp = client.post("/api/recommend/from-script", json={
        "script": "这是一个科技感十足的AI视频制作工具",
        "style": "二次元",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["tags"]) > 0
