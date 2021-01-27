from typing import Any, Optional

from django.http import JsonResponse
from pydantic import BaseModel


class ResponseSchema(BaseModel):
    success: bool
    data: Any


def json_success_response(data: Optional[Any] = None) -> JsonResponse:
    if data is None:
        data = {}
    return JsonResponse(ResponseSchema(success=True, data=data).dict())
