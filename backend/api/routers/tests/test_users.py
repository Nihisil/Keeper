from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.auth import create_token_for_user
from lib.users.crud import fake_users_db
from lib.users.models import UserDB

client = TestClient(app)


def test_get_current_user_info():
    token = create_token_for_user(UserDB(**fake_users_db["johndoe"]))
    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["username"] == "johndoe"
