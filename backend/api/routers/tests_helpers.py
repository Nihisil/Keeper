from typing import Dict

from fastapi import APIRouter

from config import get_settings
from lib.auth import Token, create_jwt_token_for_user
from lib.db import get_client
from lib.users.crud import create_user

router = APIRouter(prefix="/tests", tags=["tests"])

TEST_USERNAME = "test"
TEST_PASSWORD = "test"


@router.post("/seed-db/", name="Clean up DB and seed it with tests data")
def seed_db() -> Dict:
    settings = get_settings()

    if not settings.is_test_env:
        raise Exception("Seed endpoint can be used only from test environment")

    client = get_client()
    client.drop_database(settings.mongo_initdb_database)

    access_token = _seed_users_data()

    return {
        "data": {
            "access_token": access_token,
            "user": {
                "username": TEST_USERNAME,
                "password": TEST_PASSWORD,
            },
        }
    }


def _seed_users_data() -> Token:
    user = create_user(TEST_USERNAME, "test@example.com", TEST_PASSWORD)
    access_token = create_jwt_token_for_user(user)
    return Token(access_token=access_token, token_type="bearer")
