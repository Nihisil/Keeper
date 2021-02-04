import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from api.routers import auth, users


def create_app(environment: str = os.getenv("ENVIRONMENT")):
    _app = FastAPI()

    # there is no need to include these middlewares to the unit tests
    if environment != "TEST":
        _app.add_middleware(TrustedHostMiddleware, allowed_hosts=[os.getenv("ALLOWED_CLIENT_HOST")])
        _app.add_middleware(
            CORSMiddleware,
            allow_origins=os.getenv("ALLOWED_CLIENT_HOST"),
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    _app.include_router(auth.router)
    _app.include_router(users.router)

    return _app


app = create_app()
