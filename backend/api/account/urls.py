from api.account.views import send_login_email
from django.urls import path

urlpatterns = [
    path("send_login_email/", send_login_email, name="send_login_email"),
]
