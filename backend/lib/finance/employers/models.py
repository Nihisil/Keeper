from lib.db import DBClass


class Employer(DBClass):
    __db_collection__ = "finance_employer"

    name: str
    archived: bool = False
    is_deleted: bool = False
