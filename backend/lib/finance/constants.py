from enum import Enum


class Currency(str, Enum):
    USD = "USD"
    RUB = "RUB"
    EUR = "EUR"
