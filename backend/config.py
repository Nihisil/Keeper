from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    environment: str
    allowed_client_host: str
    version: str

    # auth
    secret_key: str
    jwt_algorithm: str
    jwt_expire_minutes: int

    # db
    mongodb_host: str
    mongo_initdb_root_username: str
    mongo_initdb_root_password: str
    mongo_initdb_database: str


@lru_cache()
def get_settings() -> Settings:
    return Settings()
