import argparse
from datetime import datetime
from typing import Dict

import requests

from lib.finance.constants import MAIN_CURRENCY, OTHER_CURRENCIES, Currency
from lib.finance.currency_exchange_rates.crud import (
    create_currency_exchange_rate,
    get_currency_exchange_rate_for_date,
)
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate
from lib.logger import set_up_logging
from lib.sentry import init_sentry

DATE_FORMAT = "%Y-%m-%d"
BASE_URL = "https://api.exchangerate.host"

init_sentry()
logger = set_up_logging()


def main():
    parser = argparse.ArgumentParser(description="Download currency exchance rates")
    parser.add_argument("--date", dest="date")
    args = parser.parse_args()

    date = datetime.utcnow().strftime(DATE_FORMAT)
    if args.date:
        date = args.date

    download_daily_update(date)


def download_daily_update(date: datetime):
    logger.info(f"Starting currency data downloading on {date}")

    data = requests.get(
        f"{BASE_URL}/{date}",
        params={
            "base": MAIN_CURRENCY.value,
            "symbols": ",".join(OTHER_CURRENCIES),
        },
    ).json()

    date = datetime.strptime(date, DATE_FORMAT)
    _insert_currency_record(date, data["rates"])

    logger.info("Finishing daily currency data downloading")


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
