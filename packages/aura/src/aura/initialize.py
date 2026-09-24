from aura.config import Settings
from aura.ledger import fund
from aura.storage import Database


def main() -> None:
    db = Database(Settings().database_url.get_secret_value())  # type: ignore[call-arg]
    with db.transaction() as session:
        fund(session, "challenge")
    db.engine.dispose()
    print("Challenge initialized idempotently: 500.00 USD, Observe, no execution adapter.")


if __name__ == "__main__":
    main()
