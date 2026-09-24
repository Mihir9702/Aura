param([switch]$NativePostgres)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
function Invoke-Checked { param([scriptblock]$Command) & $Command; if ($LASTEXITCODE -ne 0) { throw "Command failed: $Command" } }
if (-not (Test-Path -LiteralPath '.env')) {
    $dbPassword = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
    $ownerKey = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
    @("AURA_DATABASE_URL=postgresql+psycopg://aura:$dbPassword@127.0.0.1:55432/aura", "AURA_OWNER_KEY=$ownerKey", "POSTGRES_PASSWORD=$dbPassword") | Set-Content -LiteralPath '.env' -Encoding utf8
}
Invoke-Checked { uv sync --locked }
Invoke-Checked { npm ci }
if ($NativePostgres) {
    & "$PSScriptRoot/postgres.ps1"
} else {
    Invoke-Checked { docker compose up -d --wait postgres }
}
Invoke-Checked { uv run alembic upgrade head }
Invoke-Checked { uv run python -m aura.initialize }
Write-Host 'Aura ready. Run scripts/dev.ps1. Your owner key is in .env; it is never sent to a provider.'
