from fastapi import APIRouter, HTTPException, status

from lib.auth import AuthRequest, Token, authenticate_user, create_jwt_token_for_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/", name="Authenticate", description="Get user token by username and password", response_model=Token
)
def auth_user(data: AuthRequest) -> Token:
    user = authenticate_user(data.username, data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    access_token = create_jwt_token_for_user(user)
    return Token(access_token=access_token, token_type="bearer")
