from lib.db import DBClass


class FinanceCategory(DBClass):
    __db_collection__ = "finance_categories"

    name: str
    is_deleted: bool = False

    amount: int = 0

    class CustomConfig:
        read_only_fields = DBClass.CustomConfig.read_only_fields | {"amount"}
