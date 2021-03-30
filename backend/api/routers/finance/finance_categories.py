from typing import List

from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token
from lib.finance.finance_categories.crud import (
    create_finance_category,
    delete_finance_category,
    get_finance_categories_list,
    update_finance_category,
)
from lib.finance.finance_categories.models import FinanceCategory

router = APIRouter(
    prefix="/finance/categories",
    tags=["finance_categories"],
)


@router.post(
    "/create",
    name="Create finance_category",
    response_model=FinanceCategory,
    dependencies=[Depends(get_current_user_from_token)],
)
def create_finance_category_api(data: FinanceCategory) -> FinanceCategory:
    return create_finance_category(data)


@router.get(
    "/get-list",
    name="Get list of finance_categories",
    response_model=List[FinanceCategory],
    dependencies=[Depends(get_current_user_from_token)],
)
def get_finance_categories_list_api() -> List[FinanceCategory]:
    return get_finance_categories_list()


@router.delete("/delete", name="Delete finance_category", dependencies=[Depends(get_current_user_from_token)])
def delete_finance_category_api(finance_category: FinanceCategory) -> FinanceCategory:
    return delete_finance_category(finance_category)


@router.put(
    "/update",
    name="Update finance_category",
    response_model=FinanceCategory,
    dependencies=[Depends(get_current_user_from_token)],
)
def update_finance_category_api(finance_category: FinanceCategory) -> FinanceCategory:
    return update_finance_category(finance_category)
