from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from api.routers import auth, users
from config import get_settings


def create_app():
    settings = get_settings()
    _app = FastAPI()

    # there is no need to include these middlewares to the unit tests
    if settings.environment != "TEST":
        _app.add_middleware(TrustedHostMiddleware, allowed_hosts=[settings.allowed_client_host])
        _app.add_middleware(
            CORSMiddleware,
            allow_origins=[settings.allowed_client_host],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    _app.include_router(auth.router)
    _app.include_router(users.router)

    return _app


app = create_app()
