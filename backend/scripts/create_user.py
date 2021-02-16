import argparse

from lib.users.crud import create_user


def main():
    parser = argparse.ArgumentParser(description="Creates new user")
    parser.add_argument("username", type=str)
    parser.add_argument("email", type=str)
    parser.add_argument("password", type=str)
    args = parser.parse_args()

    user = create_user(args.username, args.email, args.password)
    print(f"{user.id} created!")


if __name__ == "__main__":
    main()
