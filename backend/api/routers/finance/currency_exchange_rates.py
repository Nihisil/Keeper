from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from lib.auth import get_current_user_from_token
from lib.finance.constants import Currency
from lib.finance.currency_exchange_rates.crud import get_currency_exchange_rates_list_for_pair
from lib.finance.currency_exchange_rates.models import CurrencyExchangeRate

router = APIRouter(
    prefix="/finance/currency-exchange-rates",
    tags=["currency_exchange_rates"],
)


class CurrencyExchangeRateResponseModel(BaseModel):
    items: List[CurrencyExchangeRate]
    page: int
    per_page: int
    count: int


@router.get(
    "/get-list",
    name="Get list of currency exchange rates for specified pair",
    response_model=CurrencyExchangeRateResponseModel,
    dependencies=[Depends(get_current_user_from_token)],
)
def get_currency_exchange_rates_api(
    from_currency: Currency, to_currency: Currency, page: int = 1
) -> CurrencyExchangeRateResponseModel:
    per_page = 25
    items, count = get_currency_exchange_rates_list_for_pair(from_currency, to_currency, per_page, page)
    return CurrencyExchangeRateResponseModel(items=items, page=page, per_page=per_page, count=count)
