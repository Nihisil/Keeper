import random
import string


def get_random_string_and_numbers(length: int) -> str:
    result = "".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(length))
    return result
