from typing import Optional

from lib.db import db_find_one, db_insert_one
from lib.users.models import User, UserWithHashedPassword


def create_user(username: str, email: str, plain_password: str) -> User:
    from lib.auth import hash_password

    # TODO validate that email is valid and unique
    data = UserWithHashedPassword(
        username=username, email=email, hashed_password=hash_password(plain_password)
    )
    data = db_insert_one(data)
    return User.parse_obj(data)


def get_user(username: str) -> Optional[User]:
    return db_find_one(User, {"username": username})


def get_user_with_hashed_password(username: str) -> Optional[UserWithHashedPassword]:
    """
    This functions should be used only for auth flow,
    in all other places we need to call get_user()
    """
    return db_find_one(UserWithHashedPassword, {"username": username})
