from datetime import datetime

from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.crud import (
    create_currency_exchange_rate,
    delete_all_currency_exchange_rates,
    get_currency_exchange_rates_list_for_pair,
)
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate


def test_create_currency_exchange_rate():
    currency_exchange_rate_data = CurrencyExchangeRate(
        from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
    )
    currency_exchange_rate = create_currency_exchange_rate(currency_exchange_rate_data)
    assert currency_exchange_rate.id is not None
    assert currency_exchange_rate.updated is not None


def test_get_currency_exchange_rates_list():
    per_page = 25
    number_of_currency_exchange_rates = 40
    for _ in range(number_of_currency_exchange_rates):
        currency_exchange_rate_data = CurrencyExchangeRate(
            from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
        )
        create_currency_exchange_rate(currency_exchange_rate_data)
    currency_exchange_rates, _ = get_currency_exchange_rates_list_for_pair(
        Currency.RUB, Currency.USD, per_page=per_page, page=1
    )
    assert len(currency_exchange_rates) == per_page

    currency_exchange_rates, _ = get_currency_exchange_rates_list_for_pair(
        Currency.RUB, Currency.USD, per_page=per_page, page=2
    )
    assert len(currency_exchange_rates) == number_of_currency_exchange_rates - per_page

    # query not exists pair
    currency_exchange_rates, _ = get_currency_exchange_rates_list_for_pair(Currency.RUB, Currency.EUR)
    assert len(currency_exchange_rates) == 0


def test_delete_all_currency_exchange_rate():
    currency_exchange_rate_data = CurrencyExchangeRate(
        from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
    )
    create_currency_exchange_rate(currency_exchange_rate_data)

    currency_exchange_rates, _ = get_currency_exchange_rates_list_for_pair(Currency.RUB, Currency.USD)
    assert len(currency_exchange_rates) == 1

    delete_all_currency_exchange_rates()

    currency_exchange_rates, _ = get_currency_exchange_rates_list_for_pair(Currency.RUB, Currency.USD)
    assert len(currency_exchange_rates) == 0
