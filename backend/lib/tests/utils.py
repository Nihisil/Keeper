from datetime import datetime
from typing import Optional, Tuple

from lib.auth import create_jwt_token_for_user
from lib.finance.accounts.crud import create_account
from lib.finance.accounts.models import Account, AccountType
from lib.finance.constants import Currency, TransactionType
from lib.finance.currency_exchange_rates.crud import create_currency_exchange_rate
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate
from lib.finance.employers.crud import create_employer
from lib.finance.employers.models import Employer
from lib.finance.finance_categories.crud import create_finance_category
from lib.finance.finance_categories.models import FinanceCategory
from lib.finance.transactions.crud import create_transaction
from lib.finance.transactions.models import Transaction
from lib.users.crud import create_user
from lib.users.models import User
from lib.utils import get_random_string_and_numbers


def create_user_for_tests(password: str = "password") -> User:
    username = get_random_string_and_numbers(12)
    return create_user(username, f"{username}@example.com", password)


def create_user_and_token_for_tests() -> Tuple[User, str]:
    user = create_user("test_username", "test@example.com", "password")
    token = create_jwt_token_for_user(user)
    return user, token


def create_account_for_tests(currency: Optional[Currency] = None):
    if not currency:
        currency = Currency.USD
    return create_account(Account(name="Test", currency=currency, account_type=AccountType.BANK))


def create_transaction_for_tests(
    amount: int,
    transaction_type=TransactionType.INCOME,
    employer: Optional[Employer] = None,
    category: Optional[FinanceCategory] = None,
):
    account = create_account_for_tests()
    if not employer:
        employer = create_employer_for_tests(account)
    return create_transaction(
        Transaction(
            type=transaction_type,
            amount=amount,
            currency=Currency.USD,
            account_id=account.id,
            from_employer_id=employer.id,
            date=datetime.utcnow(),
            main_currency_exchange_rate=100,
            category_id=category and category.id,
        )
    )


def create_employer_for_tests(account: Account):
    return create_employer(Employer(name="Test", associated_account_id=account.id))


def create_finance_category_for_tests():
    return create_finance_category(FinanceCategory(name="Test"))


def create_currency_exchange_rate_for_tests(rate: float = 1.50):
    return create_currency_exchange_rate(
        CurrencyExchangeRate(
            from_currency=Currency.RUB, to_currency=Currency.USD, rate=rate, date=datetime.utcnow()
        )
    )
