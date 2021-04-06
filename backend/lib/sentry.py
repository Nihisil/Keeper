import sentry_sdk

from config import get_settings

settings = get_settings()


def init_sentry() -> None:
    if not settings.sentry_dsn:
        return

    sentry_sdk.init(dsn=settings.sentry_dsn)
