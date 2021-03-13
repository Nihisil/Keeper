from datetime import datetime

from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.crud import create_currency_exchange_rate
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate
from lib.tests.utils import create_user_and_token_for_tests

client = TestClient(app)


def test_get_list_of_currency_exchange_rates_api():
    user, token = create_user_and_token_for_tests()

    number_of_currency_exchange_rates = 40
    for _ in range(number_of_currency_exchange_rates):
        currency_exchange_rate_data = CurrencyExchangeRate(
            from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
        )
        create_currency_exchange_rate(currency_exchange_rate_data)

    response = client.get(
        "/finance/currency-exchange-rates/get-list",
        params={"from_currency": Currency.RUB.value, "to_currency": Currency.USD.value, "page": 1},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["per_page"] > 0
    assert response_data["page"] == 1
    assert response_data["count"] == number_of_currency_exchange_rates
    assert len(response_data["items"]) == response_data["per_page"]

    response = client.get(
        "/finance/currency-exchange-rates/get-list",
        params={"from_currency": Currency.RUB.value, "to_currency": Currency.USD.value, "page": 2},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["page"] == 2
    assert len(response_data["items"]) == number_of_currency_exchange_rates - response_data["per_page"]
