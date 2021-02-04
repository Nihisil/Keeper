from lib.users.models import UserDB

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    }
}


def get_user(username: str) -> UserDB:
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return UserDB(**user_dict)
