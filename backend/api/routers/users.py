from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token, verify_request_has_auth_token
from lib.users.models import UserDB, UserResponse

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(verify_request_has_auth_token)])


@router.get("/me/", response_model=UserResponse)
def get_user_info(current_user: UserDB = Depends(get_current_user_from_token)):
    return UserResponse.parse_obj(current_user)
