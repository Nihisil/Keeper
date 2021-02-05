from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.auth import AuthRequest
from lib.users.crud import create_user

client = TestClient(app)


def test_get_access_token_by_username_and_password():
    user = create_user("username", "test@example.com", plain_password="test")
    response = client.post("/auth/", json=AuthRequest(username=user.username, password="test").dict())
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["access_token"] is not None


def test_get_access_token_with_wrong_password():
    response = client.post("/auth/", json=AuthRequest(username="not-exists", password="fake").dict())
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_access_token_without_required_fields():
    response = client.post("/auth/")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
