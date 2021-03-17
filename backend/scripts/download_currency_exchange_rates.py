import argparse
from datetime import datetime
from typing import Dict

import requests

from lib.finance.constants import MAIN_CURRENCY, OTHER_CURRENCIES, Currency
from lib.finance.currency_exchange_rates.crud import (
    create_currency_exchange_rate,
    delete_all_currency_exchange_rates,
    get_currency_exchange_rate_for_date,
)
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate

DATE_FORMAT = "%Y-%m-%d"
BASE_URL = "https://api.exchangeratesapi.io"


def main():
    parser = argparse.ArgumentParser(description="Download currency exchance rates")
    parser.add_argument("--history", dest="history", action="store_true")
    args = parser.parse_args()

    if args.history:
        # it is important to clear existing data before download historic data
        delete_all_currency_exchange_rates()
        download_history_data()
    else:
        download_daily_update()


def download_history_data():
    start_date = datetime(2015, 1, 1).strftime("%Y-%m-%d")
    end_date = datetime.utcnow().strftime(DATE_FORMAT)

    data = requests.get(
        f"{BASE_URL}/history",
        params={
            "start_at": start_date,
            "end_at": end_date,
            "base": MAIN_CURRENCY.value,
            "symbols": ",".join(OTHER_CURRENCIES),
        },
    ).json()["rates"]

    for date, rates in data.items():
        date = datetime.strptime(date, DATE_FORMAT)
        _insert_currency_record(date, rates)


def download_daily_update():
    data = requests.get(
        f"{BASE_URL}/latest",
        params={
            "base": MAIN_CURRENCY.value,
            "symbols": ",".join(OTHER_CURRENCIES),
        },
    ).json()

    date = datetime.strptime(data["date"], DATE_FORMAT)
    _insert_currency_record(date, data["rates"])


def _insert_currency_record(date: datetime, rates: Dict):
    for symbol in OTHER_CURRENCIES:
        exist_record = get_currency_exchange_rate_for_date(
            from_currency=MAIN_CURRENCY, to_currency=Currency(symbol), date=date
        )
        if exist_record:
            continue

        rate = 1 / rates[symbol]
        item = CurrencyExchangeRate(
            from_currency=MAIN_CURRENCY.value, to_currency=symbol, rate=rate, date=date
        )
        create_currency_exchange_rate(item)


if __name__ == "__main__":
    main()
