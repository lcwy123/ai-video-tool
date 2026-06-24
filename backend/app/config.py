from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/ai_video_tool"
    cors_origins: list[str] = ["http://localhost:3000"]
    upload_dir: str = "./uploads"

    class Config:
        env_file = ".env"


settings = Settings()
