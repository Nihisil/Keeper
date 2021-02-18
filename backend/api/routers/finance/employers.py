from typing import List

from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token
from lib.finance.employers.crud import create_employer, delete_employer, get_employers_list
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


@router.delete("/delete/{employer_id}", name="Delete employer")
def delete_employer_api(employer_id: str, current_user: User = Depends(get_current_user_from_token)) -> dict:
    delete_employer(employer_id, current_user)
    return {"success": True}
