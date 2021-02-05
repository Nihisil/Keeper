from typing import Optional

from lib.db import DBClass


class User(DBClass):
    __db_collection__ = "users"

    id: Optional[str]
    username: str
    email: str


class UserWithHashedPassword(User):
    """
    Model for auth flow, in all other places we need to use User model
    """

    hashed_password: str
