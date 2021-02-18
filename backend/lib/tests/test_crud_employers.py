from lib.finance.employers.crud import create_employer, delete_employer, get_employers_list
from lib.finance.employers.models import Employer
from lib.tests.utils import create_user_for_tests


def test_create_employer():
    user = create_user_for_tests()
    employer_data = Employer(name="Test")
    employer = create_employer(employer_data, user)
    assert employer.id is not None
    assert employer.updated is not None


def test_get_employers_list():
    user = create_user_for_tests()
    number_of_employers = 4
    for i in range(number_of_employers):
        employer_data = Employer(name=f"Test {i}")
        create_employer(employer_data, user)
    employers = get_employers_list(user)
    assert len(employers) == number_of_employers


def test_delete_employer():
    user = create_user_for_tests()
    employer = create_employer(Employer(name="Test"), user)
    delete_employer(employer.id, user)
    assert len(get_employers_list(user)) == 0
