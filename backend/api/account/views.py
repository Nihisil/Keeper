from api.utils import json_success_response
from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import HttpRequest, JsonResponse


def send_login_email(request: HttpRequest) -> JsonResponse:
    email = request.POST.get("email", "").strip().lower()

    try:
        User.objects.get(email=email)
    except User.DoesNotExist:
        # user doesn't exists, but let's return success response
        # so, client will not know if this user exists or not
        return json_success_response()

    # TODO implement login via url
    send_mail(
        "Keeper login",
        "To login click on the link: ",
        settings.FROM_EMAIL,
        [email],
        fail_silently=False,
    )

    return json_success_response()
