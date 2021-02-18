from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.tests.utils import create_user_and_token_for_tests

client = TestClient(app)


def test_get_current_user_info():
    user, token = create_user_and_token_for_tests()
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
