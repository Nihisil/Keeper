from typing import List

from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token
from lib.finance.employers.crud import create_employer, get_employers_list
from lib.finance.employers.models import Employer
from lib.users.models import User

router = APIRouter(
    prefix="/finance/employers",
    tags=["employers"],
)


@router.post("/create", name="Create employer", response_model=Employer)
def create_employer_api(
    data: Employer, current_user: User = Depends(get_current_user_from_token)
) -> Employer:
    data.user_id = current_user.id
    return create_employer(data)


@router.get("/get-list", name="Get list of employers", response_model=List[Employer])
def get_employers_list_api(current_user: User = Depends(get_current_user_from_token)) -> List[Employer]:
    return get_employers_list(current_user)
