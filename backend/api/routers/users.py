from fastapi import APIRouter, Depends

from lib.auth import get_current_user_from_token, verify_request_has_auth_token
from lib.users.models import User

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(verify_request_has_auth_token)])


@router.get("/me/", name="User info", description="Get current user profile information", response_model=User)
def get_user_info(current_user: User = Depends(get_current_user_from_token)) -> User:
    return current_user
