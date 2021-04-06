from typing import Optional

from lib.db import DBClass
from lib.finance.accounts.models import Account
from lib.finance.constants import Currency


class Employer(DBClass):
    __db_collection__ = "finance_employer"

    name: str
    archived: bool = False
    is_deleted: bool = False

    associated_account_id: Optional[str]
    associated_account: Optional[Account]

    earnings: int = 0
    earnings_currency: Optional[Currency] = None

    class CustomConfig:
        read_only_fields = DBClass.CustomConfig.read_only_fields | {"earnings", "earnings_currency"}
        related_models = {
            "associated_account_id": Account,
        }
