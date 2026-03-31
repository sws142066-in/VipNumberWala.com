@echo off
REM ========================================
REM LifetimeNumber Admin Server Startup
REM ========================================

echo.
echo Starting LifetimeNumber Admin Backend Server...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist package.json (
    echo ERROR: package.json not found
    echo Make sure you're in the server directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the server
echo.
echo ========================================
echo Starting server on port 5000...
echo ========================================
echo.
call npm start

pause
