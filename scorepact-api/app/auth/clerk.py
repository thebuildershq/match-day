from typing import Annotated

from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from clerk_backend_api import Clerk, AuthenticateRequestOptions

from app.config import settings
from app.db import get_db
from app.models import User


clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    """Verify the Clerk JWT and return the matching User row (auto-create on first hit)."""
    try:
        state = clerk.authenticate_request(
            request,
            AuthenticateRequestOptions(authorized_parties=[settings.FRONTEND_URL]),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Auth error: {e}",
        )

    if not state.is_signed_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    clerk_user_id = state.payload.get("sub")
    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No subject in token",
        )

    user = db.query(User).filter(User.clerk_user_id == clerk_user_id).first()
    if user is None:
        # First authenticated hit — sync user details from Clerk
        clerk_user = clerk.users.get(user_id=clerk_user_id)

        primary_email = ""
        if clerk_user.email_addresses:
            for em in clerk_user.email_addresses:
                if em.id == clerk_user.primary_email_address_id:
                    primary_email = em.email_address
                    break

        name_parts = [p for p in [clerk_user.first_name, clerk_user.last_name] if p]
        name = " ".join(name_parts) if name_parts else None

        user = User(
            clerk_user_id=clerk_user_id,
            email=primary_email,
            name=name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
