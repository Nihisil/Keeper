from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one
from lib.finance.employers.models import Employer


def create_employer(employer: Employer) -> Employer:
    data = db_insert_one(employer)
    return data


def get_employer_by_id(employer_id: str) -> Optional[Employer]:
    return db_find_one_by_id(Employer, employer_id, {})


def get_employers_list(include_deleted: bool = False) -> List[Employer]:
    sorting = ["updated", pymongo.DESCENDING]
    data, _ = db_find_all(Employer, {"is_deleted": include_deleted}, sorting)
    return data


def delete_employer(employer: Employer) -> None:
    employer.is_deleted = True
    db_update_one(employer)
    return None


def update_employer(employer: Employer) -> Employer:
    return db_update_one(employer)
