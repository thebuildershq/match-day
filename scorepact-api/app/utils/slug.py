import re
import secrets
from sqlalchemy.orm import Session

from app.models import Pool


def slugify(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9-]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "pool"


def generate_unique_slug(db: Session, name: str) -> str:
    base = slugify(name)
    slug = base
    suffix = 0
    while db.query(Pool).filter(Pool.slug == slug).first() is not None:
        suffix += 1
        slug = f"{base}-{suffix}"
    return slug


def generate_invite_code() -> str:
    return secrets.token_urlsafe(8)
