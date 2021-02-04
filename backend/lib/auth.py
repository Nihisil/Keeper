import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status
from fastapi.requests import Request
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from passlib.context import CryptContext

from lib.users.crud import get_user
from lib.users.models import TokenData, UserDB

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 365

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def verify_request_has_auth_token(request: Request) -> str:
    """
    Make sure that auth token is present in the request header.

    This dependency should be used for all routes except auth router.
    """
    authorization: str = request.headers.get("Authorization")

    scheme, token = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != "bearer":
        raise credentials_exception

    return token


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_token_for_user(user: UserDB) -> str:
    if not user:
        raise credentials_exception
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)


def get_current_user_from_token(request: Request) -> UserDB:
    token = verify_request_has_auth_token(request)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception

    return user
