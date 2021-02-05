from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str


class UserWithHashedPassword(User):
    """
    Model for auth flow, in all other places we need to use User model
    """

    hashed_password: str
