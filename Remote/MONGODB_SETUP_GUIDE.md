# 🍃 MongoDB Setup Guide for Team Tracker

## 📋 After MongoDB Installation

### Step 1: Verify MongoDB Installation
```cmd
# Check if MongoDB service is running
net start | findstr -i mongo

# If not running, start it
net start MongoDB

# Verify MongoDB version
mongod --version
```

### Step 2: Test Database Connection
```cmd
# Run the connection test script
test-mongodb.bat
```

### Step 3: Initialize Database with Sample Data
```cmd
# Navigate to backend directory
cd backend

# Initialize database with sample data
npm run init-db
```

## 🔗 MongoDB Compass Connection

**Connection String:**
```
mongodb://127.0.0.1:27017/productivity_tracker
```

**Manual Connection Details:**
- Host: `127.0.0.1` (or `localhost`)
- Port: `27017`
- Database: `productivity_tracker`
- Authentication: None

## 👤 Default Login Credentials

After running `npm run init-db`, you can login with:

**Manager Account:**
- Email: `dhchaudhary973@gmail.com`
- Password: `dhp@973`

**Team Member Account:**
- Email: `john.doe@example.com`
- Password: `password123`

## 📊 Expected Database Collections

After initialization, you should see:
- `users` - User accounts and profiles
- `tasks` - Task management data
- `timeentries` - Time tracking records
- `screenshots` - Screenshot monitoring data
- `productivitymetrics` - Analytics and metrics

## 🚀 Starting Your Application

1. **Start Backend:**
   ```cmd
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```cmd
   cd frontend
   npm run dev
   ```

3. **Or use the batch file:**
   ```cmd
   start-web.bat
   ```

## 🔧 Troubleshooting

### MongoDB Service Won't Start
```cmd
# Try starting as Administrator
net start MongoDB

# Check Windows Services
services.msc
# Look for "MongoDB" service and start it
```

### Connection Refused Error
1. Ensure MongoDB service is running
2. Check if port 27017 is available
3. Verify .env file configuration
4. Try restarting MongoDB service

### Database Not Found
- The database will be created automatically when you first connect
- Run `npm run init-db` to populate with sample data

## 📱 Useful Commands

```cmd
# Initialize database with sample data
npm run init-db

# Create a new manager account
npm run create-manager

# View database statistics
npm run db-stats

# Test MongoDB connection
test-mongodb.bat
```

## 🌐 Access Your Application

After everything is set up:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Landing Page:** http://localhost:3000/#landing

## 💡 Tips

1. **Keep MongoDB service running** - It should start automatically with Windows
2. **Use MongoDB Compass** for visual database management
3. **Check logs** if something isn't working - they're very helpful
4. **Backup your data** regularly if you're using this for important work

## 🆘 Need Help?

If you encounter issues:
1. Check the console logs in your terminal
2. Verify MongoDB service status
3. Ensure all dependencies are installed (`npm install`)
4. Try restarting both MongoDB and your application
