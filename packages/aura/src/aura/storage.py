from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


class Base(DeclarativeBase):
    pass


class Database:
    def __init__(self, url: str):
        if not url.startswith("postgresql+psycopg://"):
            raise ValueError("PostgreSQL is required; no in-memory operational fallback")
        self.engine = create_engine(url, pool_pre_ping=True, hide_parameters=True)
        self.sessions = sessionmaker(self.engine, expire_on_commit=False)

    @contextmanager
    def transaction(self) -> Iterator[Session]:
        with self.sessions.begin() as session:
            yield session
