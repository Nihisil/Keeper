from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one_by_id
from lib.finance.employers.models import Employer


def create_employer(employer_data: Employer) -> Employer:
    data = db_insert_one(employer_data)
    return data


def get_employer_by_id(employer_id: str) -> Optional[Employer]:
    return db_find_one_by_id(Employer, employer_id, {})


def get_employers_list(include_deleted: bool = False) -> List[Employer]:
    sorting = ["updated", pymongo.DESCENDING]
    return db_find_all(Employer, {"is_deleted": include_deleted}, sorting)


def delete_employer(employer: Employer) -> None:
    employer.is_deleted = True
    db_update_one_by_id(Employer, str(employer.id), employer.dict())
    return None


def update_employer(employer: Employer) -> Employer:
    updated = db_update_one_by_id(Employer, str(employer.id), employer.dict())
    employer.updated = updated
    return employer
