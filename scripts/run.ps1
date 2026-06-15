# Build (if needed) and run the full app on one port — opens in browser
# Usage: .\scripts\run.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$distIndex = Join-Path $root "frontend\dist\index.html"

if (-not (Test-Path $distIndex)) {
    Write-Host "Building frontend (first run)..." -ForegroundColor Cyan
    Set-Location "$root\frontend"
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ""
Write-Host "Starting Guest House app on http://localhost:5000 ..." -ForegroundColor Cyan
Set-Location "$root\backend"
$env:SERVE_FRONTEND = "true"
$env:NODE_ENV = "production"

$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:root\backend
    $env:SERVE_FRONTEND = "true"
    $env:NODE_ENV = "production"
    node server.js 2>&1
}

$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 2
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch { }
    Start-Sleep -Seconds 1
}

if (-not $ready) {
    Write-Host "Server failed to start:" -ForegroundColor Red
    Receive-Job $serverJob
    exit 1
}

Write-Host "  -> http://localhost:5000" -ForegroundColor Green
Write-Host "  Login: admin@guesthouse.com / admin123" -ForegroundColor Gray
Start-Process "http://localhost:5000"

Receive-Job $serverJob -Wait
