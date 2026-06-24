from openai import AsyncOpenAI

from app.config import settings
from app.providers.base_llm import BaseLLMProvider, LLMResult


class OpenAILLMProvider(BaseLLMProvider):
    def __init__(self):
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._default_model = "gpt-4o"

    async def generate(self, prompt: str, system_prompt: str = "", **kwargs) -> LLMResult:
        model = kwargs.get("model", self._default_model)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self._client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 2048),
        )
        return LLMResult(
            text=response.choices[0].message.content or "",
            model=model,
            usage={"prompt_tokens": response.usage.prompt_tokens if response.usage else 0},
        )
