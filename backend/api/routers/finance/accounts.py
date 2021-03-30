from typing import List

from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token
from lib.finance.accounts.crud import create_account, delete_account, get_accounts_list, update_account
from lib.finance.accounts.models import Account

router = APIRouter(
    prefix="/finance/accounts",
    tags=["accounts"],
)


@router.post(
    "/create",
    name="Create account",
    response_model=Account,
    dependencies=[Depends(get_current_user_from_token)],
)
def create_account_api(data: Account) -> Account:
    return create_account(data)


@router.get(
    "/get-list",
    name="Get list of accounts",
    response_model=List[Account],
    dependencies=[Depends(get_current_user_from_token)],
)
def get_accounts_list_api() -> List[Account]:
    return get_accounts_list()


@router.delete("/delete", name="Delete account", dependencies=[Depends(get_current_user_from_token)])
def delete_account_api(account: Account) -> Account:
    return delete_account(account)


@router.put(
    "/update",
    name="Update account",
    response_model=Account,
    dependencies=[Depends(get_current_user_from_token)],
)
def update_account_api(account: Account) -> Account:
    return update_account(account)
