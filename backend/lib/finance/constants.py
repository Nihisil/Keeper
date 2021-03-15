from enum import Enum


class Currency(str, Enum):
    RUB = "RUB"
    USD = "USD"
    EUR = "EUR"


MAIN_SYMBOL = Currency.RUB.value
OTHER_SYMBOLS = [x.value for x in list(Currency) if x.value != Currency.RUB.value]


class TransactionType(str, Enum):
    REGULAR = "REGULAR"
    INCOME = "INCOME"
