import string
from random import SystemRandom

safe_random = SystemRandom()


def get_random_string_and_numbers(length: int) -> str:
    available_options = string.ascii_lowercase + string.digits
    result = "".join(safe_random.choice(available_options) for _ in range(length))
    return result
