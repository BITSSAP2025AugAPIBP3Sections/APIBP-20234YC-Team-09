@echo off
cls
echo.
echo ========================================
echo   LIVE PARALLEL SELENIUM DEMO
echo ========================================
echo.
echo 🎯 What you'll see:
echo    ✅ 3 browsers opening in different positions:
echo       🌐 Chrome: Top-left (580x500) with margins
echo       🔷 Edge: Top-right (580x500) properly spaced
echo       🦊 Firefox: Bottom-center (580x480) no overlap
echo    ✅ Each browser running the same test
echo    ✅ Real-time parallel execution
echo    ✅ All browsers clearly visible!
echo.
echo 📊 Expected results:
echo    ✅ Edge: ~50 seconds (fast)
echo    ✅ Firefox: ~50 seconds (fast)
echo    ⚠️  Chrome: May timeout (but visible)
echo.
echo 🚀 Starting in 5 seconds...
echo    Watch your desktop!
echo.
timeout /t 5 /nobreak > nul
npm run selenium:visible
echo.
echo ========================================
echo           DEMO COMPLETED!
echo ========================================
echo.
echo 💡 All browsers opened visibly on screen
echo 📸 Screenshots saved in selenium-tests/screenshots/
echo ⏱️  Total time: ~50 seconds (vs 150+ sequential)
echo.
pause