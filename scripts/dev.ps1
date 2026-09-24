param([switch]$BackendOnly)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
if (-not (Test-Path '.env') -or -not (Test-Path '.venv/Scripts/python.exe')) {
    throw 'Run scripts/bootstrap.ps1 first (use -NativePostgres for installed PostgreSQL 17).'
}
function Test-Port([int]$Port) {
    $client = New-Object Net.Sockets.TcpClient
    try { $client.Connect('127.0.0.1', $Port); return $true } catch { return $false }
    finally { $client.Dispose() }
}
if (Test-Port 8000) { throw 'Port 8000 is already in use. Stop the existing Aura launcher before starting another.' }
if (-not $BackendOnly -and (Test-Port 5173)) {
    throw 'Port 5173 is already in use. Stop the existing web server first, or run scripts/dev.ps1 -BackendOnly.'
}
if (Test-Port 55432) {
    Write-Host 'Local database port is available; verifying through API health.'
} elseif (Test-Path '.cache/postgres/PG_VERSION') {
    & "$PSScriptRoot/postgres.ps1"
} else {
    docker compose up -d --wait postgres
    if ($LASTEXITCODE) { throw 'PostgreSQL could not start. Check Docker Desktop or run native bootstrap.' }
}
New-Item -ItemType Directory -Path '.cache' -Force | Out-Null
$backend = $null
$worker = $null
try {
    $backend = Start-Process -FilePath '.venv/Scripts/python.exe' -ArgumentList '-m uvicorn apps.api.main:app --host 127.0.0.1 --port 8000' -WindowStyle Hidden -PassThru -RedirectStandardOutput '.cache/api.stdout.log' -RedirectStandardError '.cache/api.stderr.log'
    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if ($backend.HasExited) { throw 'API exited. Check .cache/api.stderr.log.' }
        try {
            $health = Invoke-RestMethod 'http://127.0.0.1:8000/api/health' -TimeoutSec 2
            if ($health.database -eq 'CONNECTED') { $ready = $true; break }
        } catch { Start-Sleep -Milliseconds 500 }
    }
    if (-not $ready) { throw 'API/database did not become ready. Check .cache/api.stderr.log and database configuration.' }
    $worker = Start-Process -FilePath '.venv/Scripts/python.exe' -ArgumentList '-m aura.worker' -WindowStyle Hidden -PassThru -RedirectStandardOutput '.cache/worker.stdout.log' -RedirectStandardError '.cache/worker.stderr.log'
    Write-Host 'Aura API and database ready. Open http://127.0.0.1:5173. Keep this terminal running.'
    if ($BackendOnly) {
        while (-not $backend.HasExited -and -not $worker.HasExited) { Start-Sleep -Seconds 1 }
        throw 'An Aura process exited. Check .cache/api.stderr.log and .cache/worker.stderr.log.'
    } else {
        npm run dev:web
        if ($LASTEXITCODE) { throw 'Web server exited with an error.' }
    }
} finally {
    foreach ($process in @($backend, $worker)) {
        if ($null -ne $process -and -not $process.HasExited) { $process.Kill() }
    }
}
