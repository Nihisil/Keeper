from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.finance.employers.crud import create_employer
from lib.finance.employers.models import Employer
from lib.tests.utils import create_user_and_token_for_tests

client = TestClient(app)


def test_create_employer_api():
    user, token = create_user_and_token_for_tests()
    employer_data = Employer(name="Test")
    response = client.post(
        "/finance/employers/create",
        json=employer_data.dict(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["id"] is not None
    assert response_data["name"] == employer_data.name
    assert response_data["user_id"] == user.id


def test_get_list_of_employers():
    user, token = create_user_and_token_for_tests()
    number_of_employers = 4
    for i in range(number_of_employers):
        employer_data = Employer(user_id=user.id, name=f"Test {i}")
        create_employer(employer_data)
    response = client.get(
        "/finance/employers/get-list",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == number_of_employers
