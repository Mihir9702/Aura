import hashlib
import secrets
from datetime import datetime, timedelta

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, Session, mapped_column

from aura.common import now
from aura.storage import Base


class OwnerSession(Base):
    __tablename__ = "owner_sessions"
    token_hash: Mapped[str] = mapped_column(String, primary_key=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


def digest(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def issue(session: Session) -> str:
    token = secrets.token_urlsafe(32)
    session.add(OwnerSession(token_hash=digest(token), expires_at=now() + timedelta(hours=8)))
    return token


def authorized(session: Session, token: str | None) -> bool:
    record = session.get(OwnerSession, digest(token)) if token else None
    return record is not None and record.expires_at > now()
