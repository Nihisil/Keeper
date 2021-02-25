from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one_by_id
from lib.finance.employers.models import Employer
from lib.users.models import User


def create_employer(employer_data: Employer, user: User) -> Employer:
    employer_data.user_id = user.id
    data = db_insert_one(employer_data)
    return data


def get_employer_by_id(employer_id: str, user: User) -> Optional[Employer]:
    return db_find_one_by_id(Employer, employer_id, {"user_id": user.id})


def get_employers_list(user: User, include_deleted: bool = False) -> List[Employer]:
    sorting = ["updated", pymongo.DESCENDING]
    return db_find_all(Employer, {"user_id": user.id, "is_deleted": include_deleted}, sorting)


def delete_employer(employer: Employer, user: User) -> None:
    # checks that we have permission to delete obj
    assert employer.user_id == user.id

    employer.is_deleted = True
    db_update_one_by_id(Employer, str(employer.id), employer.dict())
    return None


def update_employer(employer: Employer, user: User) -> Employer:
    # checks that we have permission to delete obj
    assert employer.user_id == user.id

    updated = db_update_one_by_id(Employer, str(employer.id), employer.dict())
    employer.updated = updated
    return employer
