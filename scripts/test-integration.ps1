$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$original = $env:AURA_DATABASE_URL
try {
    $line = Get-Content -LiteralPath '.env' | Where-Object { $_.StartsWith('AURA_DATABASE_URL=') }
    $env:AURA_DATABASE_URL = $line.Substring('AURA_DATABASE_URL='.Length) -replace '/aura$', '/aura_test'
    $env:AURA_TEST_DATABASE_URL = $env:AURA_DATABASE_URL
    uv run python scripts/prepare_testdb.py; if ($LASTEXITCODE) { throw 'Test database setup failed' }
    uv run alembic upgrade head; if ($LASTEXITCODE) { throw 'Test migration failed' }
    uv run pytest -m integration -p no:cacheprovider; if ($LASTEXITCODE) { throw 'Integration tests failed' }
} finally { $env:AURA_DATABASE_URL = $original; Remove-Item Env:AURA_TEST_DATABASE_URL -ErrorAction SilentlyContinue }
