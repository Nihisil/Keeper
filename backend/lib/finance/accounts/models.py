from enum import Enum

from lib.db import DBClass
from lib.finance.constants import Currency


class AccountType(str, Enum):
    BANK = "BANK"
    CASH = "CASH"
    INVESTING = "INVESTING"
    OTHER = "OTHER"


class Account(DBClass):
    __db_collection__ = "finance_account"

    name: str
    currency: Currency
    account_type: AccountType
    is_deleted: bool = False

    class Config:
        use_enum_values = True
