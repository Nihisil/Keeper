from datetime import datetime
from typing import List, Optional, Tuple

import pymongo

from lib.db import db_drop_collection, db_find_all, db_find_one, db_insert_one
from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate


def create_currency_exchange_rate(currency_exchange_rate: CurrencyExchangeRate) -> CurrencyExchangeRate:
    data = db_insert_one(currency_exchange_rate)
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


def get_currency_exchange_rate_for_date(
    from_currency: Currency, to_currency: Currency, date: datetime
) -> Optional[CurrencyExchangeRate]:
    return db_find_one(
        CurrencyExchangeRate,
        {"from_currency": from_currency.value, "to_currency": to_currency.value, "date": date},
    )


def get_currency_exchange_rate_for_nearest_date(
    from_currency: Currency, to_currency: Currency, date: datetime
) -> Optional[CurrencyExchangeRate]:
    """
    Sometimes there is no rate on specified date.
    In this case we need to load rate on nearest date before.
    """
    results, _ = db_find_all(
        CurrencyExchangeRate,
        {"from_currency": from_currency.value, "to_currency": to_currency.value, "date": {"$lte": date}},
        ["date", pymongo.DESCENDING],
        limit=1,
    )
    assert len(results), "Empty nearest exchange rate query"
    return results[0]
