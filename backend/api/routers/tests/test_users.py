from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.auth import create_jwt_token_for_user
from lib.users.crud import get_user

client = TestClient(app)


def test_get_current_user_info():
    user = get_user("johndoe")
    token = create_jwt_token_for_user(user)
    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["username"] == "johndoe"
    assert response.json().get("password") is None
    assert response.json().get("hashed_password") is None
