# SonarQube Setup Script for Windows
# Run this to start SonarQube server with Docker

Write-Host "🚀 Starting SonarQube Server..." -ForegroundColor Cyan

# Start SonarQube with PostgreSQL
docker-compose -f docker-compose.sonar.yml up -d sonarqube sonarqube-db

Write-Host "`n⏳ Waiting for SonarQube to start (this may take 2-3 minutes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host "`n✅ SonarQube is starting up!" -ForegroundColor Green
Write-Host "`n📊 Access SonarQube at: http://localhost:9000" -ForegroundColor Cyan
Write-Host "   Default credentials: admin / admin" -ForegroundColor White
Write-Host "`n⚠️  Please change the password on first login!" -ForegroundColor Yellow

Write-Host "`n📝 To run code analysis:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.sonar.yml run --rm sonar-scanner" -ForegroundColor White

Write-Host "`n🛑 To stop SonarQube:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.sonar.yml down" -ForegroundColor White
