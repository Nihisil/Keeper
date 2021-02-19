from typing import List

from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token
from lib.finance.employers.crud import create_employer, delete_employer, get_employers_list, update_employer
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
    return create_employer(data, current_user)


@router.get("/get-list", name="Get list of employers", response_model=List[Employer])
def get_employers_list_api(current_user: User = Depends(get_current_user_from_token)) -> List[Employer]:
    return get_employers_list(current_user)


@router.delete("/delete", name="Delete employer")
def delete_employer_api(
    employer: Employer, current_user: User = Depends(get_current_user_from_token)
) -> dict:
    delete_employer(employer, current_user)
    return {"success": True}


@router.put("/update", name="Update employer", response_model=Employer)
def update_employer_api(
    employer: Employer, current_user: User = Depends(get_current_user_from_token)
) -> Employer:
    return update_employer(employer, current_user)
