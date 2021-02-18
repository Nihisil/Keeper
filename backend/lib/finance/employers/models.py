from typing import Optional

from lib.db import DBClass


class Employer(DBClass):
    __db_collection__ = "finance_employer"

    user_id: Optional[str]
    name: str
    archived: bool = False
