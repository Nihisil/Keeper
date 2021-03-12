from typing import List

import pymongo

from lib.db import db_delete_one_by_id, db_find_all, db_insert_one, db_update_one_by_id
from lib.finance.constants import Currency
from lib.finance.exchange_rates.models import CurrencyExchangeRate


def create_currency_exchange_rate(currency_exchange_rate_data: CurrencyExchangeRate) -> CurrencyExchangeRate:
    data = db_insert_one(currency_exchange_rate_data)
    return data


def get_currency_exchange_rates_list_by_pair(
    from_currency: Currency, to_currency: Currency
) -> List[CurrencyExchangeRate]:
    sorting = ["date", pymongo.DESCENDING]
    return db_find_all(
        CurrencyExchangeRate,
        {
            "from_currency": from_currency.value,
            "to_currency": to_currency.value,
        },
        sorting,
    )


def delete_currency_exchange_rate(currency_exchange_rate: CurrencyExchangeRate) -> None:
    return db_delete_one_by_id(CurrencyExchangeRate, str(currency_exchange_rate.id))


def update_currency_exchange_rate(currency_exchange_rate: CurrencyExchangeRate) -> CurrencyExchangeRate:
    updated = db_update_one_by_id(
        CurrencyExchangeRate, str(currency_exchange_rate.id), currency_exchange_rate.dict()
    )
    currency_exchange_rate.updated = updated
    return currency_exchange_rate
