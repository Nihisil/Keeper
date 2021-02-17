from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status
from fastapi.requests import Request
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from config import get_settings
from lib.users.crud import get_user, get_user_with_hashed_password
from lib.users.models import User, UserWithHashedPassword

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


def verify_request_has_auth_token(request: Request) -> str:
    """
    Make sure that auth token is present in the request header.

    This dependency should be used for all routes except auth router.
    """
    authorization: str = request.headers.get("Authorization")

    scheme, token = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return token


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bool(pwd_context.verify(plain_password, hashed_password))


def hash_password(password: str) -> str:
    return str(pwd_context.hash(password))


def authenticate_user(username: str, password: str) -> Optional[User]:
    user: Optional[UserWithHashedPassword] = get_user_with_hashed_password(username)
    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    # we don't want to pass `UserWithHashedPassword.hashed password` attribute to other functions
    return User.parse_obj(user)


def create_jwt_token_for_user(user: User) -> str:
    to_encode = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes),
    }
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return str(encoded_jwt)


def get_current_user_from_token(request: Request) -> User:
    token = verify_request_has_auth_token(request)

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user = get_user(username)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return user
