from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.finance.finance_categories.crud import create_finance_category
from lib.finance.finance_categories.models import FinanceCategory
from lib.tests.utils import create_user_and_token_for_tests

client = TestClient(app)


def test_create_finance_category_api():
    user, token = create_user_and_token_for_tests()
    finance_category_data = FinanceCategory(name="Test")
    response = client.post(
        "/finance/categories/create",
        data=finance_category_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["id"] is not None
    assert response_data["name"] == finance_category_data.name


def test_get_list_of_finance_categories_api():
    user, token = create_user_and_token_for_tests()
    number_of_finance_categories = 4
    for i in range(number_of_finance_categories):
        finance_category_data = FinanceCategory(name=f"Test {i}")
        create_finance_category(finance_category_data)
    response = client.get(
        "/finance/categories/get-list",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == number_of_finance_categories


def test_delete_finance_category_api():
    user, token = create_user_and_token_for_tests()
    finance_category = create_finance_category(FinanceCategory(name="Test"))
    response = client.delete(
        "/finance/categories/delete",
        data=finance_category.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK


def test_update_finance_category_api():
    user, token = create_user_and_token_for_tests()
    finance_category = create_finance_category(FinanceCategory(name="Test"))
    new_data = FinanceCategory(**finance_category.dict())
    new_data.name = "Updated"
    response = client.put(
        "/finance/categories/update",
        data=new_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["name"] == new_data.name
