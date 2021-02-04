from typing import Optional

from pydantic import BaseModel


class UserResponse(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None


class UserDB(UserResponse):
    """
    Model that should be used to store information about user in DB
    """

    hashed_password: str


class UserTokenRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
