"""Exports schema without connecting to storage or using real credentials."""
import json
from pathlib import Path

from aura.api import create_app
from aura.config import Settings

app = create_app(Settings(database_url="postgresql+psycopg://schema@127.0.0.1/schema",
                          owner_key="schema-generation-only-not-a-real-key"))
target = Path("packages/contracts/openapi.json")
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
app.state.database.engine.dispose()
