from enum import Enum

MONEY_DIGITS = 100


class Currency(str, Enum):
    RUB = "RUB"
    USD = "USD"
    EUR = "EUR"


MAIN_CURRENCY = Currency.RUB
OTHER_CURRENCIES = [x.value for x in list(Currency) if x.value != MAIN_CURRENCY.value]


class TransactionType(str, Enum):
    REGULAR = "REGULAR"
    INCOME = "INCOME"
