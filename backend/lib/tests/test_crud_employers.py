from lib.finance.employers.crud import create_employer, get_employers_list
from lib.finance.employers.models import Employer
from lib.tests.utils import create_user_for_tests


def test_create_employer():
    user = create_user_for_tests()
    employer_data = Employer(user_id=user.id, name="Test")
    employer = create_employer(employer_data)
    assert employer.id is not None


def test_get_employers_list():
    user = create_user_for_tests()
    number_of_employers = 4
    for i in range(number_of_employers):
        employer_data = Employer(user_id=user.id, name=f"Test {i}")
        create_employer(employer_data)
    employers = get_employers_list(user)
    assert len(employers) == number_of_employers
