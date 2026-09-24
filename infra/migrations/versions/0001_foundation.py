"""Initial PostgreSQL foundation, with append-only balanced journal constraints."""
from alembic import op

revision = "0001"
down_revision = None


def upgrade():
    op.execute("""
CREATE TABLE execution_gates (id varchar PRIMARY KEY, version integer NOT NULL,
 entry_halt boolean NOT NULL, full_kill boolean NOT NULL);
INSERT INTO execution_gates VALUES ('global', 1, false, false);
CREATE TABLE portfolios (id varchar PRIMARY KEY, environment varchar NOT NULL
 CHECK (environment IN ('ACTIVE_PAPER','SHADOW')), version integer NOT NULL,
 capital numeric(28,8) NOT NULL CHECK(capital > 0));
CREATE TABLE journals (id varchar PRIMARY KEY, portfolio_id varchar NOT NULL REFERENCES portfolios,
 source_key varchar NOT NULL UNIQUE, facts jsonb NOT NULL);
CREATE TABLE postings (id serial PRIMARY KEY, journal_id varchar NOT NULL REFERENCES journals,
 account varchar NOT NULL, amount numeric(28,8) NOT NULL CHECK (amount <> 0));
CREATE INDEX postings_journal ON postings(journal_id);
CREATE TABLE lots (id varchar PRIMARY KEY, ordinal integer NOT NULL,
 portfolio_id varchar NOT NULL REFERENCES portfolios, instrument varchar NOT NULL,
 strategy_scope varchar NOT NULL, quantity numeric(28,8) NOT NULL CHECK(quantity >= 0),
 basis numeric(28,8) NOT NULL CHECK(basis >= 0));
CREATE TABLE fixture_orders (id varchar PRIMARY KEY, portfolio_id varchar NOT NULL REFERENCES portfolios,
 instrument varchar NOT NULL, strategy_scope varchar NOT NULL, side varchar NOT NULL CHECK(side IN ('BUY','SELL')),
 quantity numeric(28,8) NOT NULL CHECK(quantity > 0), filled numeric(28,8) NOT NULL CHECK(filled >= 0 AND filled <= quantity),
 price_bound numeric(28,8) NOT NULL, fee_budget numeric(28,8) NOT NULL, fees_paid numeric(28,8) NOT NULL,
 state varchar NOT NULL, gate_version integer NOT NULL);
CREATE TABLE outbox (sequence bigserial PRIMARY KEY, event_id varchar NOT NULL UNIQUE,
 event_type varchar NOT NULL, aggregate_id varchar NOT NULL, aggregate_version integer NOT NULL,
 correlation_id varchar NOT NULL, payload jsonb NOT NULL, recorded_at timestamptz NOT NULL,
 schema_version integer NOT NULL);
CREATE TABLE inbox (id bigserial PRIMARY KEY, consumer varchar NOT NULL, event_id varchar NOT NULL,
 processed_at timestamptz NOT NULL, UNIQUE(consumer,event_id));
CREATE TABLE owner_sessions (token_hash varchar PRIMARY KEY, expires_at timestamptz NOT NULL);
CREATE FUNCTION aura_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
 BEGIN RAISE EXCEPTION 'Accounting/audit records are append-only'; END $$;
CREATE TRIGGER journals_immutable BEFORE UPDATE OR DELETE ON journals FOR EACH ROW EXECUTE FUNCTION aura_immutable();
CREATE TRIGGER postings_immutable BEFORE UPDATE OR DELETE ON postings FOR EACH ROW EXECUTE FUNCTION aura_immutable();
CREATE TRIGGER outbox_immutable BEFORE UPDATE OR DELETE ON outbox FOR EACH ROW EXECUTE FUNCTION aura_immutable();
CREATE FUNCTION aura_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
 DECLARE target varchar; total numeric; count_rows integer;
 BEGIN
  IF TG_TABLE_NAME = 'journals' THEN target := NEW.id; ELSE target := NEW.journal_id; END IF;
  SELECT COALESCE(sum(amount),0), count(*) INTO total,count_rows FROM postings WHERE journal_id=target;
  IF total <> 0 OR count_rows < 2 THEN RAISE EXCEPTION 'Unbalanced or empty journal %', target; END IF;
  RETURN NULL;
 END $$;
CREATE CONSTRAINT TRIGGER journal_balance AFTER INSERT ON journals DEFERRABLE INITIALLY DEFERRED
 FOR EACH ROW EXECUTE FUNCTION aura_balanced();
CREATE CONSTRAINT TRIGGER posting_balance AFTER INSERT ON postings DEFERRABLE INITIALLY DEFERRED
 FOR EACH ROW EXECUTE FUNCTION aura_balanced();
""")


def downgrade():
    raise RuntimeError("Initial ledger migration is forward-only; restore a verified backup instead")
