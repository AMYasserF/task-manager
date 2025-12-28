# Quick Setup Script for Task Manager

Write-Host "🚀 Task Manager - Quick Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Setup Backend
Write-Host "`n📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (!(Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

# Create .env if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    @"
PORT=5000
JWT_SECRET=change-this-secret-key-in-production-$(Get-Random)
JWT_EXPIRES_IN=24h
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Set-Location ..

# Setup Frontend
Write-Host "`n📦 Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend

if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

Set-Location ..

# Summary
Write-Host "`n✨ Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "To start the application:`n" -ForegroundColor Yellow
Write-Host "Backend:" -ForegroundColor Cyan
Write-Host "  cd backend && npm start`n" -ForegroundColor White

Write-Host "Frontend:" -ForegroundColor Cyan
Write-Host "  cd frontend && npm run dev`n" -ForegroundColor White

Write-Host "Or use Docker:" -ForegroundColor Cyan
Write-Host "  docker-compose up --build`n" -ForegroundColor White

Write-Host "📖 See README.md for more information" -ForegroundColor Yellow
