import pytest
from api.account.factories import UserFactory
from django.urls import reverse


@pytest.mark.django_db
def test_send_login_url_via_email(client, mailoutbox):
    email = "test@example.com"
    UserFactory(email=email)
    response = client.post(reverse("send_login_email"), {"email": email}).json()
    assert response["success"] is True
    assert len(mailoutbox) == 1


@pytest.mark.django_db
def test_send_login_url_and_not_correct_email(client, mailoutbox):
    response = client.post(reverse("send_login_email"), {"email": "NOT_CORRECT"}).json()
    # response still should be true
    assert response["success"] is True
    # but no emails should be sent
    assert len(mailoutbox) == 0
