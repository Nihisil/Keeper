from typing import List

from lib.db import db_find_all, db_insert_one
from lib.finance.employers.models import Employer
from lib.users.models import User


def create_employer(employer_data: Employer) -> Employer:
    data = db_insert_one(employer_data)
    return data


def get_employers_list(user: User) -> List[Employer]:
    return db_find_all(Employer, {"user_id": user.id})
