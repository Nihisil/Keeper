from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from api.routers import auth, users
from config import get_settings


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name


def create_app() -> FastAPI:
    settings = get_settings()

    default_responses = {status.HTTP_401_UNAUTHORIZED: {"description": "Incorrect auth credentials"}}

    _app = FastAPI(
        title="Keeper",
        description=(
            "Project to keep information about read/watched books/comics/cinema/tv-shows/etc, "
            "and other different stuff (like personal bookkeeping)."
        ),
        responses=default_responses,  # type: ignore
        redoc_url=None,
        version="0.0.1",
    )

    # there is no need to include these middlewares to the unit tests
    if settings.environment != "TEST":
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
use_route_names_as_operation_ids(app)
