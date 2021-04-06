from config import get_settings
import sentry_sdk

settings = get_settings()


def init_sentry() -> None:
    if not settings.sentry_dsn:
        return

    sentry_sdk.init(dsn=settings.sentry_dsn)
