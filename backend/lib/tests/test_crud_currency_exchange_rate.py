from datetime import datetime

from lib.finance.constants import Currency
from lib.finance.exchange_rates.crud import (
    create_currency_exchange_rate,
    delete_currency_exchange_rate,
    get_currency_exchange_rates_list_by_pair,
    update_currency_exchange_rate,
)
from lib.finance.exchange_rates.models import CurrencyExchangeRate


def test_create_currency_exchange_rate():
    currency_exchange_rate_data = CurrencyExchangeRate(
        from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
    )
    currency_exchange_rate = create_currency_exchange_rate(currency_exchange_rate_data)
    assert currency_exchange_rate.id is not None
    assert currency_exchange_rate.updated is not None


def test_get_currency_exchange_rates_list():
    number_of_currency_exchange_rates = 4
    for _ in range(number_of_currency_exchange_rates):
        currency_exchange_rate_data = CurrencyExchangeRate(
            from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
        )
        create_currency_exchange_rate(currency_exchange_rate_data)
    currency_exchange_rates = get_currency_exchange_rates_list_by_pair(Currency.RUB, Currency.USD)
    assert len(currency_exchange_rates) == number_of_currency_exchange_rates

    currency_exchange_rates = get_currency_exchange_rates_list_by_pair(Currency.RUB, Currency.EUR)
    assert len(currency_exchange_rates) == 0


def test_delete_currency_exchange_rate():
    currency_exchange_rate = create_currency_exchange_rate(
        CurrencyExchangeRate(
            from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
        )
    )
    delete_currency_exchange_rate(currency_exchange_rate)
    assert len(get_currency_exchange_rates_list_by_pair(Currency.RUB, Currency.EUR)) == 0


def test_update_currency_exchange_rate():
    currency_exchange_rate_data = CurrencyExchangeRate(
        from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
    )
    currency_exchange_rate = create_currency_exchange_rate(currency_exchange_rate_data)
    assert currency_exchange_rate.id is not None
    assert currency_exchange_rate.updated is not None

    updated_currency_exchange_rate = CurrencyExchangeRate(**currency_exchange_rate_data.dict())
    updated_currency_exchange_rate.rate = 2.50
    updated_currency_exchange_rate = update_currency_exchange_rate(updated_currency_exchange_rate)

    assert updated_currency_exchange_rate.id == currency_exchange_rate.id
    assert updated_currency_exchange_rate.rate != currency_exchange_rate.rate
