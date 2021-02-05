from typing import Optional

from lib.users.models import User, UserWithHashedPassword

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    }
}


def get_user(username: str) -> Optional[User]:
    if username not in fake_users_db:
        return None
    user_dict = fake_users_db[username]
    return User(**user_dict)


def get_user_with_hashed_password(username: str) -> Optional[UserWithHashedPassword]:
    """
    This functions should be used only for auth flow,
    in all other places we need to call get_user()
    """
    if username not in fake_users_db:
        return None
    user_dict = fake_users_db[username]
    return UserWithHashedPassword(**user_dict)
