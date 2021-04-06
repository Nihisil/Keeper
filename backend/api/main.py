from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from starlette.responses import JSONResponse

from api.routers import auth, users
from api.routers.finance import accounts, currency_exchange_rates, employers, finance_categories, transactions
from config import get_settings
from lib.sentry import init_sentry

settings = get_settings()


cors_settings = {
    "allow_origins": [settings.allowed_client_host],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}


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
    default_responses = {status.HTTP_401_UNAUTHORIZED: {"description": "Incorrect auth credentials"}}

    init_sentry()

    _app = FastAPI(
        title="Keeper",
        description=(
            "Project to keep information about read/watched books/comics/cinema/tv-shows/etc, "
            "and other different stuff (like personal bookkeeping)."
        ),
        responses=default_responses,  # type: ignore
        redoc_url=None,
        version=settings.version,
    )

    # there is no need to include these middlewares to the unit tests
    if settings.environment != "TEST":
        _app.add_middleware(
            CORSMiddleware,
            **cors_settings,
        )

    if settings.sentry_dsn:
        _app.add_middleware(SentryAsgiMiddleware)

    _app.include_router(auth.router)
    _app.include_router(users.router)
    _app.include_router(employers.router)
    _app.include_router(accounts.router)
    _app.include_router(currency_exchange_rates.router)
    _app.include_router(transactions.router)
    _app.include_router(finance_categories.router)

    return _app


app = create_app()
use_route_names_as_operation_ids(app)


@app.exception_handler(500)
async def custom_http_exception_handler(request, exception) -> JSONResponse:  # type: ignore
    """
    Solution to display the proper error response instead of CORS error.
    Source: https://github.com/tiangolo/fastapi/issues/775#issuecomment-723628299
    """
    response = JSONResponse(content={"error": str(exception)}, status_code=500)

    # Since the CORSMiddleware is not executed when an unhandled server exception
    # occurs, we need to manually set the CORS headers ourselves if we want the FE
    # to receive a proper JSON 500, opposed to a CORS error.
    # Setting CORS headers on server errors is a bit of a philosophical topic of
    # discussion in many frameworks, and it is currently not handled in FastAPI.
    # See dotnet core for a recent discussion, where ultimately it was
    # decided to return CORS headers on server failures:
    # https://github.com/dotnet/aspnetcore/issues/2378
    origin = request.headers.get("origin")

    # Have the middleware do the heavy lifting for us to parse
    # all the config, then update our response headers
    cors = CORSMiddleware(
        app=app,
        **cors_settings,  # type: ignore
    )

    # Logic directly from Starlette's CORSMiddleware:
    # https://github.com/encode/starlette/blob/master/starlette/middleware/cors.py#L152

    response.headers.update(cors.simple_headers)
    has_cookie = "cookie" in request.headers

    # If request includes any cookie headers, then we must respond
    # with the specific origin instead of '*'.
    if cors.allow_all_origins and has_cookie:
        response.headers["Access-Control-Allow-Origin"] = origin

    # If we only allow specific origins, then we have to mirror back
    # the Origin header in the response.
    elif not cors.allow_all_origins and cors.is_allowed_origin(origin=origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers.add_vary_header("Origin")

    return response
