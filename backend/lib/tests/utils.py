from typing import Tuple

from lib.auth import create_jwt_token_for_user
from lib.users.crud import create_user
from lib.users.models import User
from lib.utils import get_random_string_and_numbers


def create_user_for_tests(password: str = "password") -> User:
    username = get_random_string_and_numbers(12)
    return create_user(username, f"{username}@example.com", password)


def create_user_and_token_for_tests() -> Tuple[User, str]:
    user = create_user("test_username", "test@example.com", "password")
    token = create_jwt_token_for_user(user)
    return user, token
