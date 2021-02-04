from fastapi import APIRouter, HTTPException, status

from lib.auth import authenticate_user, create_token_for_user
from lib.users.models import Token, UserTokenRequest

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/", response_model=Token)
def auth_user(data: UserTokenRequest):
    user = authenticate_user(data.username, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}
