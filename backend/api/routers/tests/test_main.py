from fastapi import status
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_endpoints_are_not_available_without_auth():
    exclude_endpoints = ["openapi", "swagger_ui_html", "swagger_ui_redirect", "redoc_html", "Authenticate"]
    url_list = [
        {"path": route.path, "name": route.name}
        for route in app.routes
        if route.name not in exclude_endpoints
    ]
    for endpoint in url_list:
        path = endpoint["path"]
        name = endpoint["name"]
        # request without auth header
        response = client.get(path)
        assert (
            response.status_code == status.HTTP_401_UNAUTHORIZED
        ), f"Not correct return status for {path}, {name}"

        # request with not valid header token
        response = client.get(
            path,
            headers={"Authorization": "Bearer NOT_VALID"},
        )
        assert (
            response.status_code == status.HTTP_401_UNAUTHORIZED
        ), f"Not correct return status for {path}, {name}"
