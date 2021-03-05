from lib.finance.accounts.crud import create_account, delete_account, get_accounts_list, update_account
from lib.finance.accounts.models import Account, AccountType
from lib.finance.constants import Currency


def test_create_account():
    account_data = Account(name="Test", currency=Currency.USD, account_type=AccountType.BANK)
    account = create_account(account_data)
    assert account.id is not None
    assert account.updated is not None


def test_get_accounts_list():
    number_of_accounts = 4
    for i in range(number_of_accounts):
        account_data = Account(name=f"Test {i}", currency=Currency.USD, account_type=AccountType.BANK)
        create_account(account_data)
    accounts = get_accounts_list()
    assert len(accounts) == number_of_accounts


def test_delete_account():
    account = create_account(Account(name="Test", currency=Currency.USD, account_type=AccountType.BANK))
    delete_account(account)
    assert len(get_accounts_list()) == 0


def test_update_account():
    account_data = Account(name="Test", currency=Currency.USD, account_type=AccountType.BANK)
    account = create_account(account_data)
    assert account.id is not None
    assert account.updated is not None

    updated_account = Account(**account_data.dict())
    updated_account.name = "New one"
    updated_account = update_account(updated_account)

    assert updated_account.id == account.id
    assert updated_account.name != account.name
