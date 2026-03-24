@echo off
echo ========================================
echo    MongoDB Connection Test
echo ========================================
echo.

echo 🔍 Testing MongoDB installation and connection...
echo.

echo 📋 Step 1: Checking if MongoDB service is running...
net start | findstr -i mongo
if %errorlevel% equ 0 (
    echo ✅ MongoDB service is running
) else (
    echo ❌ MongoDB service is not running
    echo 🔧 Trying to start MongoDB service...
    net start MongoDB
    if %errorlevel% equ 0 (
        echo ✅ MongoDB service started successfully
    ) else (
        echo ❌ Failed to start MongoDB service
        echo 💡 Try running as Administrator or check installation
        pause
        exit /b 1
    )
)

echo.
echo 📋 Step 2: Testing MongoDB connection...
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('🔗 Connected to:', process.env.MONGODB_URI);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });
"

if %errorlevel% equ 0 (
    echo.
    echo 🎉 MongoDB is working correctly!
    echo.
    echo 📋 Next steps:
    echo    1. Initialize database: npm run init-db
    echo    2. Start your application: npm run dev
    echo.
    echo 🔗 MongoDB Compass Connection String:
    echo    mongodb://127.0.0.1:27017/productivity_tracker
) else (
    echo.
    echo ❌ MongoDB connection test failed
    echo.
    echo 🔧 Troubleshooting:
    echo    1. Make sure MongoDB is installed correctly
    echo    2. Check if MongoDB service is running: net start MongoDB
    echo    3. Verify port 27017 is not blocked
    echo    4. Check .env file configuration
)

echo.
pause
