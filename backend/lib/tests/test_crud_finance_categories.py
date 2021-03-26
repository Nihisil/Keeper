from lib.finance.finance_categories.crud import (
    create_finance_category,
    delete_finance_category,
    get_finance_categories_list,
    update_finance_category,
)
from lib.finance.finance_categories.models import FinanceCategory


def test_create_finance_category():
    finance_category_data = FinanceCategory(name="Test")
    finance_category = create_finance_category(finance_category_data)
    assert finance_category.id is not None
    assert finance_category.updated is not None


def test_get_finance_categories_list():
    number_of_finance_categories = 4
    for i in range(number_of_finance_categories):
        finance_category_data = FinanceCategory(name=f"Test {i}")
        create_finance_category(finance_category_data)
    finance_categories = get_finance_categories_list()
    assert len(finance_categories) == number_of_finance_categories


def test_delete_finance_category():
    finance_category = create_finance_category(FinanceCategory(name="Test"))
    delete_finance_category(finance_category)
    assert len(get_finance_categories_list()) == 0


def test_update_finance_category():
    finance_category_data = FinanceCategory(name="Test")
    finance_category = create_finance_category(finance_category_data)
    assert finance_category.id is not None
    assert finance_category.updated is not None

    updated_finance_category = FinanceCategory(**finance_category_data.dict())
    updated_finance_category.name = "New one"
    updated_finance_category = update_finance_category(updated_finance_category)

    assert updated_finance_category.id == finance_category.id
    assert updated_finance_category.name != finance_category.name
