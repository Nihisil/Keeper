from lib.finance.employers.crud import create_employer, delete_employer, get_employers_list, update_employer
from lib.finance.employers.models import Employer
from lib.tests.utils import create_account_for_tests, create_transaction_for_tests


def test_create_employer():
    account = create_account_for_tests()
    employer_data = Employer(name="Test", associated_account_id=account.id)
    employer = create_employer(employer_data)
    assert employer.id is not None
    assert employer.updated is not None


def test_get_employers_list():
    account = create_account_for_tests()
    number_of_employers = 4
    for i in range(number_of_employers):
        employer = create_employer(Employer(name=f"Test {i}", associated_account_id=account.id))
        create_transaction_for_tests(amount=i + 1, employer=employer)

    employers = get_employers_list()
    assert len(employers) == number_of_employers
    assert employers[0].earnings == 4
    assert employers[0].earnings_currency is not None
    assert employers[1].earnings == 3
    assert employers[2].earnings == 2
    assert employers[3].earnings == 1


def test_delete_employer():
    account = create_account_for_tests()
    employer = create_employer(Employer(name="Test", associated_account_id=account.id))
    delete_employer(employer)
    assert len(get_employers_list()) == 0


def test_update_employer():
    account = create_account_for_tests()
    employer_data = Employer(name="Test", associated_account_id=account.id)
    employer = create_employer(employer_data)
    assert employer.id is not None
    assert employer.updated is not None

    updated_employer = Employer(**employer_data.dict())
    updated_employer.name = "New one"
    updated_employer = update_employer(updated_employer)

    assert updated_employer.id == employer.id
    assert updated_employer.name != employer.name
