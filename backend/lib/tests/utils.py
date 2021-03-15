from typing import Optional, Tuple

from lib.auth import create_jwt_token_for_user
from lib.finance.accounts.crud import create_account
from lib.finance.accounts.models import Account, AccountType
from lib.finance.constants import Currency, TransactionType
from lib.finance.employers.crud import create_employer
from lib.finance.employers.models import Employer
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
    data = Account(name="Test", currency=currency, account_type=AccountType.BANK)
    return create_account(data)


def create_transaction_for_tests(amount: int):
    account = create_account_for_tests()
    employer = create_employer_for_tests()
    transaction_data = Transaction(
        type=TransactionType.INCOME,
        amount=amount,
        currency=Currency.USD,
        account_id=account.id,
        from_employer_id=employer.id,
    )
    return create_transaction(transaction_data)


def create_employer_for_tests():
    data = Employer(name="Test")
    return create_employer(data)
