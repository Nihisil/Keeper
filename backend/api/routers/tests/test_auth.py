from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.auth import AuthRequest
from lib.tests.utils import create_user_for_tests

client = TestClient(app)


def test_get_access_token_by_username_and_password():
    password = "test"
    user = create_user_for_tests(password)
    response = client.post("/auth/", json=AuthRequest(username=user.username, password=password).dict())
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["access_token"] is not None


def test_get_access_token_with_wrong_password():
    response = client.post("/auth/", json=AuthRequest(username="not-exists", password="fake").dict())
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_access_token_without_required_fields():
    response = client.post("/auth/")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
