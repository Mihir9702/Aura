"""Prevent later transactions from appending postings to a sealed journal."""
from alembic import op

revision = "0002"
down_revision = "0001"


def upgrade():
    op.execute("""
ALTER TABLE journals ADD COLUMN creation_tx bigint NOT NULL DEFAULT txid_current();
CREATE FUNCTION aura_posting_insert() RETURNS trigger LANGUAGE plpgsql AS $$
 BEGIN
  IF NOT EXISTS (SELECT 1 FROM journals WHERE id=NEW.journal_id AND creation_tx=txid_current()) THEN
   RAISE EXCEPTION 'Cannot append to a committed journal';
  END IF;
  RETURN NEW;
 END $$;
CREATE TRIGGER postings_insert BEFORE INSERT ON postings
 FOR EACH ROW EXECUTE FUNCTION aura_posting_insert();
""")


def downgrade():
    raise RuntimeError("Forward-only accounting migration")
