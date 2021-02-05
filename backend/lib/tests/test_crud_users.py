from lib.users.crud import create_user, get_user, get_user_with_hashed_password


def test_create_user_and_verify_password():
    user = create_user("test", "test@test.com", "password")
    assert user.username == "test"
    assert user.email == "test@test.com"
    assert user.id is not None


def test_get_user():
    user = create_user("test", "test@test.com", "password")
    loaded_user = get_user(user.username)
    assert loaded_user.id == user.id
    assert loaded_user.username == user.username
    assert loaded_user.email == user.email
    assert hasattr(loaded_user, "password") is False
    assert hasattr(loaded_user, "hashed_password") is False


def test_get_user_with_password():
    password = "password"
    user = create_user("test", "test@test.com", password)
    loaded_user = get_user_with_hashed_password(user.username)
    assert loaded_user.id == user.id
    assert loaded_user.username == user.username
    assert loaded_user.email == user.email
    assert loaded_user.hashed_password is not None
    assert loaded_user.hashed_password != password
    assert hasattr(user, "password") is False
