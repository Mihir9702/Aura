"""Create only the fixed, loopback-local Aura integration database if absent."""
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

from aura.config import Settings

url = make_url(Settings().database_url.get_secret_value())
if url.host != "127.0.0.1" or url.port != 55432 or url.database != "aura_test":
    raise RuntimeError("Test setup requires the isolated loopback aura_test database")
engine = create_engine(url.set(database="postgres"), isolation_level="AUTOCOMMIT", hide_parameters=True)
with engine.connect() as connection:
    if not connection.scalar(text("SELECT 1 FROM pg_database WHERE datname='aura_test'")):
        connection.execute(text('CREATE DATABASE aura_test'))
engine.dispose()
