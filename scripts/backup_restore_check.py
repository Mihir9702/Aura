"""Verify a local backup using a newly created disposable restore database.

Never drops or overwrites an existing database. Credentials stay out of argv/logs.
"""
import os
import subprocess
from pathlib import Path
from uuid import uuid4

from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

from aura.config import Settings

url = make_url(Settings().database_url.get_secret_value())
if url.host != "127.0.0.1" or url.port != 55432 or url.database != "aura":
    raise RuntimeError("Restore drill supports only the isolated local Aura cluster")
bin_dir = Path(r"C:\Program Files\PostgreSQL\17\bin")
dump = Path(".cache/restore-check.dump").resolve()
dump.parent.mkdir(exist_ok=True)
env = dict(os.environ, PGPASSWORD=url.password or "")
args = ["-h", "127.0.0.1", "-p", "55432", "-U", url.username or "aura"]
subprocess.run([str(bin_dir / "pg_dump.exe"), *args, "-d", "aura", "-Fc", "-f", str(dump)],
               env=env, check=True, capture_output=True)
restore_name = "aura_restore_" + uuid4().hex
admin = create_engine(url.set(database="postgres"), isolation_level="AUTOCOMMIT")
created = False
try:
    with admin.connect() as connection:
        connection.execute(text(f'CREATE DATABASE "{restore_name}"'))
        created = True
    subprocess.run([str(bin_dir / "pg_restore.exe"), *args, "-d", restore_name,
                    "--exit-on-error", str(dump)], env=env, check=True, capture_output=True)
    restored = create_engine(url.set(database=restore_name))
    try:
        with restored.connect() as connection:
            invalid = connection.scalar(text("SELECT count(*) FROM (SELECT journal_id FROM postings "
                "GROUP BY journal_id HAVING sum(amount) <> 0) invalid"))
            funding = connection.scalar(text("SELECT count(*) FROM journals "
                                              "WHERE source_key='fund:challenge'"))
            version = connection.scalar(text("SELECT version_num FROM alembic_version"))
            if invalid or funding != 1 or version != "0002":
                raise RuntimeError("Restored ledger/migration verification failed")
        print("Restore verified: balanced journals, unique challenge funding, migration 0002.")
    finally:
        restored.dispose()
finally:
    if created:
        # This identifier was created by this invocation; no existing DB can be targeted.
        with admin.connect() as connection:
            connection.execute(text(f'DROP DATABASE "{restore_name}"'))
    admin.dispose()
