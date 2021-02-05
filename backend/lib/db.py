from typing import Optional, Type, TypeVar

from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.database import Database

from config import get_settings

settings = get_settings()
T = TypeVar("T", bound="DBClass")


def get_client() -> MongoClient:
    return MongoClient(
        settings.mongodb_host,
        username=settings.mongo_initdb_root_username,
        password=settings.mongo_initdb_root_password,
    )


def get_db() -> Database:
    return get_client().get_database(settings.mongo_initdb_database)


class DBClass(BaseModel):
    __db_collection__: str

    id: Optional[str]


def db_insert_one(obj: T) -> T:
    db = get_db()
    db_result = db[obj.__db_collection__].insert_one(obj.dict())
    obj.id = str(db_result.inserted_id)
    return obj


def db_find_one(obj_class: Type[T], query: dict) -> Optional[T]:
    db = get_db()
    data = db[obj_class.__db_collection__].find_one(query)
    if not data:
        return None
    data["id"] = str(data["_id"])
    return obj_class(**data)
