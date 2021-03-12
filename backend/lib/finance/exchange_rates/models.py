from datetime import datetime

from lib.db import DBClass
from lib.finance.constants import Currency


class CurrencyExchangeRate(DBClass):
    __db_collection__ = "finance_currency_exchange_rate"

    from_currency: Currency
    to_currency: Currency
    rate: float
    date: datetime
