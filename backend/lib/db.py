from datetime import datetime
from typing import List, Optional, Type, TypeVar

from bson import ObjectId
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
    updated: Optional[datetime]


def db_insert_one(obj: T) -> T:
    db = get_db()

    obj.updated = datetime.utcnow()
    obj_data = obj.dict()
    del obj_data["id"]

    db_result = db[obj.__db_collection__].insert_one(obj.dict())

    obj.id = str(db_result.inserted_id)
    return obj


def db_find_one(obj_class: Type[T], query: dict) -> Optional[T]:
    db = get_db()
    data = db[obj_class.__db_collection__].find_one(query)
    if not data:
        return None
    _map_id(data)
    return obj_class(**data)


def db_find_one_by_id(obj_class: Type[T], obj_id: str, query: dict) -> Optional[T]:
    query.update({"_id": ObjectId(obj_id)})
    return db_find_one(obj_class, query)


def db_find_all(obj_class: Type[T], query: dict, sorting: Optional[list]) -> List[T]:
    db = get_db()
    data = db[obj_class.__db_collection__].find(query)
    if sorting:
        data = data.sort(*sorting)
    results = []
    for x in data:
        _map_id(x)
        results.append(obj_class(**x))
    return results


def db_update_one_by_id(obj_class: Type[T], obj_id: str, fields_to_update: dict) -> datetime:
    db = get_db()

    updated = datetime.utcnow()
    fields_to_update["updated"] = updated
    del fields_to_update["id"]

    db[obj_class.__db_collection__].update_one({"_id": ObjectId(obj_id)}, {"$set": fields_to_update})

    return updated


def db_delete_one_by_id(obj_class: Type[T], obj_id: str) -> None:
    db = get_db()
    db[obj_class.__db_collection__].delete_one({"_id": ObjectId(obj_id)})
    return None


def _map_id(data: dict) -> None:
    data["id"] = str(data["_id"])
