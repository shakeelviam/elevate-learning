from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # PostgreSQL
    database_url: str = "postgresql://postgres:postgres@localhost:5432/elevate_ai"

    # ChromaDB
    chroma_db_path: str = "./chroma_db"
    chroma_collection_name: str = "exam_materials"

    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_llm_model: str = "llama3"
    ollama_embed_model: str = "nomic-embed-text"

    # Sentence-Transformers fallback
    embed_model_name: str = "all-MiniLM-L6-v2"

    # JWT
    secret_key: str = "insecure-dev-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # CORS
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Admin
    admin_username: str = "admin"
    admin_password: str = "changeme"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
