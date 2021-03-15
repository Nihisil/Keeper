from typing import Dict, Optional

from pydantic import validator

from lib.db import DBClass
from lib.finance.accounts.crud import get_account_by_id
from lib.finance.constants import Currency, TransactionType


class Transaction(DBClass):
    __db_collection__ = "finance_transaction"

    amount: int

    # for income transaction
    from_employer_id: Optional[str]
    account_id: str

    type: TransactionType
    currency: Currency

    @validator("type")
    def validate_type(cls, value: str, values: Dict) -> str:
        if value == TransactionType.INCOME.value and not values.get("from_employer_id"):
            raise ValueError("from_employer_id should be set for income transactions")
        return value

    @validator("currency")
    def validate_currency(cls, value: str, values: Dict) -> str:
        # could be better to get account from context, but pydantic doesn't support it yet
        account = get_account_by_id(values["account_id"])
        assert account
        if value != account.currency:
            raise ValueError("account currency didn't match transaction currency")
        return value