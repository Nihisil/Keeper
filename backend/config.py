from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    environment: str
    allowed_client_host: str

    secret_key: str
    jwt_algorithm: str
    jwt_expire_time: int = 60 * 24 * 365


@lru_cache()
def get_settings():
    return Settings()
