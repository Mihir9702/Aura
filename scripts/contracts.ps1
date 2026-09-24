$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
uv run python scripts/export_contracts.py; if ($LASTEXITCODE) { exit $LASTEXITCODE }
npx openapi-typescript packages/contracts/openapi.json -o apps/web/src/api.generated.ts
exit $LASTEXITCODE
