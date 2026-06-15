# Start backend + frontend dev servers and open the site
# Usage: .\scripts\dev.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Wait-ForUrl($url, $maxSeconds = 60) {
    $elapsed = 0
    while ($elapsed -lt $maxSeconds) {
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
            if ($r.StatusCode -eq 200) { return $true }
        } catch { }
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
    return $false
}

Write-Host ""
Write-Host "Starting Guest House dev servers..." -ForegroundColor Cyan

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:root\backend
    node server.js 2>&1
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:root\frontend
    npm run dev 2>&1
}

Write-Host "  Waiting for backend (port 5000)..." -ForegroundColor Gray
if (-not (Wait-ForUrl "http://localhost:5000/api/health")) {
    Write-Host "Backend failed to start:" -ForegroundColor Red
    Receive-Job $backendJob
    exit 1
}

Write-Host "  Waiting for frontend (port 5173)..." -ForegroundColor Gray
if (-not (Wait-ForUrl "http://localhost:5173")) {
    Write-Host "Frontend failed to start:" -ForegroundColor Red
    Receive-Job $frontendJob
    exit 1
}

Write-Host ""
Write-Host "  App ready:" -ForegroundColor Green
Write-Host "  -> http://localhost:5173" -ForegroundColor White
Write-Host "  Login: admin@guesthouse.com / admin123" -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:5173"

Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor Yellow
try {
    while ($true) {
        $b = Get-Job -Id $backendJob.Id
        $f = Get-Job -Id $frontendJob.Id
        if ($b.State -eq "Failed" -or $f.State -eq "Failed") {
            Write-Host "A server stopped unexpectedly." -ForegroundColor Red
            Receive-Job $backendJob, $frontendJob
            break
        }
        Start-Sleep -Seconds 2
    }
} finally {
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -Force -ErrorAction SilentlyContinue
}
