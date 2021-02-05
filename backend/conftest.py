import pytest

from config import get_settings
from lib.db import get_client


@pytest.fixture(autouse=True)
def run_around_tests():
    settings = get_settings()

    # setup
    # to be sure that each test is independent
    client = get_client()
    client.drop_database(settings.mongo_initdb_database)

    yield

    # teardown
