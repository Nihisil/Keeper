from datetime import datetime

from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.crud import (
    create_currency_exchange_rate,
    delete_all_currency_exchange_rates,
    get_currency_exchange_rate_for_date,
    get_currency_exchange_rate_for_nearest_date,
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


def test_get_currency_exchange_rate_for_date():
    date = datetime.utcnow()
    currency_exchange_rate_data = CurrencyExchangeRate(
        from_currency=Currency.RUB, to_currency=Currency.USD, rate=1.50, date=datetime.utcnow()
    )
    create_currency_exchange_rate(currency_exchange_rate_data)

    data = get_currency_exchange_rate_for_date(Currency.RUB, Currency.USD, date)
    assert data.id is not None


def test_get_currency_exchange_rate_for_nearest_date():
    dates = [
        datetime(2020, 1, 10),
        datetime(2020, 1, 11),
        datetime(2020, 1, 14),
    ]
    rates = []
    for i, date in enumerate(dates):
        currency_exchange_rate_data = CurrencyExchangeRate(
            date=date, from_currency=Currency.RUB, to_currency=Currency.USD, rate=i
        )
        rates.append(create_currency_exchange_rate(currency_exchange_rate_data))

    date = datetime(2020, 1, 13)
    data = get_currency_exchange_rate_for_nearest_date(Currency.RUB, Currency.USD, date)
    assert data.date.strftime("%Y-%m-%d") == "2020-01-11"

    date = datetime(2020, 1, 14)
    data = get_currency_exchange_rate_for_nearest_date(Currency.RUB, Currency.USD, date)
    assert data.date.strftime("%Y-%m-%d") == "2020-01-14"
