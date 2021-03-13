import argparse
from datetime import datetime

import requests

from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.crud import (
    create_currency_exchange_rate,
    delete_all_currency_exchange_rates,
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
    main_symbol = Currency.RUB.value
    other_symbols = [x.value for x in list(Currency) if x.value != Currency.RUB.value]

    data = requests.get(
        f"{BASE_URL}/history",
        params={
            "start_at": start_date,
            "end_at": end_date,
            "base": main_symbol,
            "symbols": ",".join(other_symbols),
        },
    ).json()["rates"]

    for date, value in data.items():
        date = datetime.strptime(date, DATE_FORMAT)
        for symbol in other_symbols:
            rate = 1 / value[symbol]
            item = CurrencyExchangeRate(from_currency=main_symbol, to_currency=symbol, rate=rate, date=date)
            create_currency_exchange_rate(item)


def download_daily_update():
    pass


if __name__ == "__main__":
    main()
