from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/")
async def user_list():
    return [{"username": "Test"},]


@router.get("/me", tags=["users"])
async def user_me():
    return {"username": "Test"}
