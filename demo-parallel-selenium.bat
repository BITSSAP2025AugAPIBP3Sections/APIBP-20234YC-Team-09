@echo off
echo.
echo ========================================
echo  SELENIUM GRID - PARALLEL DEMO
echo ========================================
echo.
echo 👀 WATCH TESTS LIVE:
echo    🌐 Chrome:  http://localhost:7900
echo    🦊 Firefox: http://localhost:7901  
echo    🔷 Edge:    http://localhost:7902
echo    📊 Grid UI: http://localhost:4444
echo.
echo 💡 Password for all VNC viewers: secret
echo.
echo 🚀 Starting parallel tests in 10 seconds...
echo    Open the URLs above to watch!
echo.
timeout /t 10 /nobreak
npm run selenium:grid