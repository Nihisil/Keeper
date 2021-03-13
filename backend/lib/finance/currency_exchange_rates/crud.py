from typing import List, Tuple

import pymongo

from lib.db import db_drop_collection, db_find_all, db_insert_one
from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate


def create_currency_exchange_rate(currency_exchange_rate_data: CurrencyExchangeRate) -> CurrencyExchangeRate:
    data = db_insert_one(currency_exchange_rate_data)
    return data


def get_currency_exchange_rates_list_for_pair(
    from_currency: Currency, to_currency: Currency, per_page: int = 25, page: int = 1
) -> Tuple[List[CurrencyExchangeRate], int]:
    assert page > 0
    assert per_page > 0
    offset = (page - 1) * per_page
    sorting = ["date", pymongo.DESCENDING]
    return db_find_all(
        CurrencyExchangeRate,
        {
            "from_currency": from_currency.value,
            "to_currency": to_currency.value,
        },
        sorting,
        limit=per_page,
        offset=offset,
    )


def delete_all_currency_exchange_rates() -> None:
    return db_drop_collection(CurrencyExchangeRate)
