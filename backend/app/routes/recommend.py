from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/recommend", tags=["recommend"])


class ScriptRecommendRequest(BaseModel):
    script: str
    style: str = "写实"


class ScriptRecommendation(BaseModel):
    suggested_background: str
    suggested_style: str
    suggested_duration: int
    suggested_mood: str
    tags: list[str]


@router.post("/from-script", response_model=ScriptRecommendation)
async def recommend_from_script(req: ScriptRecommendRequest):
    """Analyze script content and return smart recommendations.

    In production, this would call an LLM (e.g., OpenAILLMProvider) to analyze
    the script and suggest background, style, duration, and mood.
    For now, return rule-based defaults based on script length and keywords.
    """
    script = req.script
    length = len(script)
    mood = "neutral"
    suggested_bg = "自然风景"

    # Simple keyword-based mood detection
    mood_keywords = {
        "科技": ["科技", "AI", "程序", "数据", "数字", "未来"],
        "温暖": ["温暖", "家", "爱", "感动", "谢谢"],
        "严肃": ["注意", "警告", "重要", "必须", "禁止"],
        "轻松": ["哈哈", "好玩", "有趣", "轻松", "快乐"],
    }

    for detected_mood, keywords in mood_keywords.items():
        if any(kw in script for kw in keywords):
            mood = detected_mood
            break

    # Style-specific background recommendations
    style_bg = {
        "写实": "自然风景",
        "卡通": "彩色卡通背景",
        "二次元": "动漫风格场景",
    }

    suggested_duration = max(5, length // 20)

    return ScriptRecommendation(
        suggested_background=style_bg.get(req.style, suggested_bg),
        suggested_style=req.style,
        suggested_duration=min(suggested_duration, 60),
        suggested_mood=mood,
        tags=[mood, req.style, "auto"],
    )
