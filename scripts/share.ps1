# Build and run the app as a single shareable link (same WiFi / LAN)
# Usage: .\scripts\share.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host ""
Write-Host "Building Guest House app..." -ForegroundColor Cyan
Set-Location "$root\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Starting shareable app..." -ForegroundColor Cyan
Set-Location "$root\backend"
$env:NODE_ENV = "production"
$env:SERVE_FRONTEND = "true"
node server.js
