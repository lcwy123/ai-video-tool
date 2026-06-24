from abc import ABC, abstractmethod


class LLMResult:
    def __init__(self, text: str, model: str, usage: dict | None = None):
        self.text = text
        self.model = model
        self.usage = usage or {}


class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, system_prompt: str = "", **kwargs) -> LLMResult:
        ...
