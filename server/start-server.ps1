# ========================================
# LifetimeNumber Admin Server Startup
# ========================================

Write-Host ""
Write-Host "Starting LifetimeNumber Admin Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found" -ForegroundColor Red
    Write-Host "Make sure you're in the server directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Start the server
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting server on port 5000..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

npm start
