import argparse

from lib.logger import set_up_logging
from lib.users.crud import create_user

logger = set_up_logging()


def main():
    parser = argparse.ArgumentParser(description="Creates new user")
    parser.add_argument("username", type=str)
    parser.add_argument("email", type=str)
    parser.add_argument("password", type=str)
    args = parser.parse_args()

    user = create_user(args.username, args.email, args.password)
    logger.info(f"{user.id} created!")


if __name__ == "__main__":
    main()
