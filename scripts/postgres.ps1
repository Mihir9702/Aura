# An isolated workspace-local cluster; never attaches to or alters existing services.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$pgBin = 'C:\Program Files\PostgreSQL\17\bin'
if (-not (Test-Path -LiteralPath "$pgBin/initdb.exe")) { throw 'PostgreSQL 17 binaries unavailable. Use Docker bootstrap instead.' }
$cluster = Join-Path (Get-Location) '.cache/postgres'
New-Item -ItemType Directory -Path '.cache' -Force | Out-Null
$passwordLine = Get-Content -LiteralPath '.env' | Where-Object { $_.StartsWith('POSTGRES_PASSWORD=') }
$pgPassword = $passwordLine.Substring('POSTGRES_PASSWORD='.Length)
if (-not (Test-Path -LiteralPath "$cluster/PG_VERSION")) {
    $passwordFile = Join-Path (Get-Location) '.cache/pg-password'
    [IO.File]::WriteAllText($passwordFile, $pgPassword)
    try { & "$pgBin/initdb.exe" -D $cluster -U aura --pwfile=$passwordFile --auth=scram-sha-256 --encoding=UTF8 --locale=C; if ($LASTEXITCODE) { throw 'initdb failed' } }
    finally { Remove-Item -LiteralPath $passwordFile -ErrorAction SilentlyContinue }
}
& "$pgBin/pg_ctl.exe" -D $cluster status 2>$null
if ($LASTEXITCODE -ne 0) {
    & "$pgBin/pg_ctl.exe" -D $cluster -l (Join-Path (Get-Location) '.cache/postgres.log') -o '-p 55432 -h 127.0.0.1' -w start
    if ($LASTEXITCODE) { throw 'PostgreSQL start failed. Check .cache/postgres.log.' }
}
$oldPassword = $env:PGPASSWORD
try {
    $env:PGPASSWORD = $pgPassword
    foreach ($database in @('aura', 'aura_test')) {
        $exists = & "$pgBin/psql.exe" -h 127.0.0.1 -p 55432 -U aura -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$database'"
        if ($LASTEXITCODE) { throw 'PostgreSQL authentication failed' }
        if ($exists -ne '1') { & "$pgBin/createdb.exe" -h 127.0.0.1 -p 55432 -U aura $database; if ($LASTEXITCODE) { throw 'Database creation failed' } }
    }
} finally { $env:PGPASSWORD = $oldPassword }
