from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from lib.auth import get_current_user_from_token
from lib.finance.accounts.models import Account
from lib.finance.transactions.crud import (
    create_transaction,
    delete_transaction,
    get_transaction_by_id,
    get_transactions_list,
    update_transaction,
)
from lib.finance.transactions.models import Transaction

router = APIRouter(
    prefix="/finance/transactions",
    tags=["transactions"],
)


class TransactionUpdatedResponse(BaseModel):
    transaction: Transaction
    account: Account


@router.post(
    "/create",
    name="Create transaction",
    response_model=TransactionUpdatedResponse,
    dependencies=[Depends(get_current_user_from_token)],
)
def create_transaction_api(data: Transaction) -> TransactionUpdatedResponse:
    transaction, account = create_transaction(data)
    return TransactionUpdatedResponse(transaction=transaction, account=account)


@router.get(
    "/get-list",
    name="Get list of transactions",
    response_model=List[Transaction],
    dependencies=[Depends(get_current_user_from_token)],
)
def get_transactions_list_api() -> List[Transaction]:
    return get_transactions_list()


@router.delete(
    "/delete",
    name="Delete transaction",
    dependencies=[Depends(get_current_user_from_token)],
    response_model=Account,
)
def delete_transaction_api(transaction: Transaction) -> Account:
    return delete_transaction(transaction)


@router.put(
    "/update",
    name="Update transaction",
    response_model=TransactionUpdatedResponse,
    dependencies=[Depends(get_current_user_from_token)],
)
def update_transaction_api(transaction: Transaction) -> TransactionUpdatedResponse:
    assert transaction.id
    old_transaction = get_transaction_by_id(transaction.id)
    assert old_transaction
    transaction, account = update_transaction(transaction, old_transaction.amount)
    return TransactionUpdatedResponse(transaction=transaction, account=account)
