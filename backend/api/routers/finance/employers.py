from typing import List

from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token
from lib.finance.employers.crud import create_employer, delete_employer, get_employers_list, update_employer
from lib.finance.employers.models import Employer

router = APIRouter(
    prefix="/finance/employers",
    tags=["employers"],
)


@router.post(
    "/create",
    name="Create employer",
    response_model=Employer,
    dependencies=[Depends(get_current_user_from_token)],
)
def create_employer_api(data: Employer) -> Employer:
    return create_employer(data)


@router.get(
    "/get-list",
    name="Get list of employers",
    response_model=List[Employer],
    dependencies=[Depends(get_current_user_from_token)],
)
def get_employers_list_api() -> List[Employer]:
    return get_employers_list()


@router.delete("/delete", name="Delete employer", dependencies=[Depends(get_current_user_from_token)])
def delete_employer_api(employer: Employer) -> dict:
    delete_employer(employer)
    return {"success": True}


@router.put(
    "/update",
    name="Update employer",
    response_model=Employer,
    dependencies=[Depends(get_current_user_from_token)],
)
def update_employer_api(employer: Employer) -> Employer:
    return update_employer(employer)
