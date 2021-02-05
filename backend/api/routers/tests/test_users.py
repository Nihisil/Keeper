from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.auth import create_jwt_token_for_user
from lib.users.crud import create_user

client = TestClient(app)


def test_get_current_user_info():
    user = create_user("test_username", "test@example.com", "password")
    token = create_jwt_token_for_user(user)
    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == user.username
    assert data["email"] == user.email
    assert data["id"] is not None
    assert data.get("password") is None
    assert data.get("hashed_password") is None
