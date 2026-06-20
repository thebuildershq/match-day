from fastapi import APIRouter

from app.auth.clerk import CurrentUser

router = APIRouter(tags=["users"])


@router.get("/me")
def me(user: CurrentUser):
    return {
        "id": str(user.id),
        "clerk_user_id": user.clerk_user_id,
        "email": user.email,
        "name": user.name,
    }
