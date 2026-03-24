@echo off
echo ========================================
echo    Starting Team Tracker Project
echo ========================================
echo.

echo 🔍 Checking MongoDB...
net start | findstr -i mongo
if %errorlevel% neq 0 (
    echo ❌ MongoDB not running. Starting MongoDB...
    net start MongoDB
)

echo.
echo 📡 Starting Backend Server...
cd backend
start "Team Tracker Backend" cmd /k "node server.js"
cd ..

echo.
echo 🌐 Starting Frontend Application...
cd frontend
start "Team Tracker Frontend" cmd /k "npx vite --host 0.0.0.0 --port 3000"
cd ..

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo 🎉 Team Tracker is starting!
echo.
echo 📋 Services:
echo    ✅ Backend:  http://localhost:5001
echo    ✅ Frontend: http://localhost:3000
echo.
echo 🔑 Login Credentials:
echo    Manager: dhchaudhary973@gmail.com / dhp@973
echo    Team Member: john.doe@example.com / password123
echo.
echo 🌐 Opening application...
start http://localhost:3000

echo.
echo 💡 Keep the terminal windows open to monitor the services.
echo Press any key to exit this window...
pause > nul
