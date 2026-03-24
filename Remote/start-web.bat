@echo off
echo ========================================
echo    Team Tracker - Web Application
echo ========================================
echo.

echo 🚀 Starting Team Tracker web services...
echo.

echo 📡 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"
timeout /t 5 /nobreak > nul

echo 🌐 Starting Frontend Application...
start "Frontend App" cmd /k "cd frontend && npx vite --host 0.0.0.0 --port 3000"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo    🎉 Web Application Started!
echo ========================================
echo.
echo 📋 Services Running:
echo    ✅ Backend Server  - http://localhost:5001
echo    ✅ Frontend App    - http://localhost:3000
echo.
echo 🔑 Manager Login:
echo    Email: dhchaudhary973@gmail.com
echo    Password: dhp@973
echo.
echo 📚 Documentation: ./docs/README.md
echo.
echo Press any key to open the web application...
pause > nul

start http://localhost:3000

echo.
echo 💡 Tip: Keep this window open to monitor the services.
echo To stop services, close their respective terminal windows.
echo.
pause
