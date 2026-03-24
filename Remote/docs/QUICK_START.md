# 🚀 Team Tracker - Quick Start Guide

Get your Team Tracker system up and running in 5 minutes!

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 16+** installed ([Download here](https://nodejs.org/))
- ✅ **MongoDB** running locally or connection string
- ✅ **Git** for version control
- ✅ **Modern web browser** (Chrome, Firefox, Safari, Edge)

## ⚡ Option 1: Automated Setup (Recommended)

### Windows Users:

```bash
# Run the automated setup script
setup.bat
```

### Manual Setup:

If the automated script doesn't work, follow the manual steps below.

## 🛠️ Option 2: Manual Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Manager Account

```bash
node scripts/create-manager.js
```

**Expected Output:**

```
🎉 Manager created successfully!
👤 Name: Dhruvil Patel
📧 Email: dhchaudhary973@gmail.com
🎯 Role: manager
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🚀 Starting the Application

### Option A: Start All Services at Once (Windows)

```bash
# From project root
start-all.bat
```

### Option B: Start Services Manually

#### Terminal 1 - Backend Server:

```bash
cd backend
npm run dev
```

**Expected Output:**

```
📧 Email service configured with Gmail SMTP
Server running on port 5001
```

#### Terminal 2 - Frontend Application:

```bash
cd frontend
npm run dev
```

**Expected Output:**

```
Local:   http://localhost:3000/
Network: http://192.168.x.x:3000/
```

## 🔑 First Login

1. **Open your browser** and go to: `http://localhost:3000`

2. **Login with Manager credentials:**

   - **Email:** `dhchaudhary973@gmail.com`
   - **Password:** `dhp@973`

3. **You should see the Manager Dashboard** with:
   - Team overview
   - Analytics charts
   - Task management
   - Email communication tools

## 🧪 Test the System

### Test 1: Send a Team Email

1. In Manager Dashboard, find "Team Communication"
2. Enter subject: "Welcome to Team Tracker!"
3. Enter message: "This is a test email from the system"
4. Click "Send to All Team Members"
5. Check console for success message

### Test 2: Create a Task

1. Navigate to "Tasks" page
2. Click "Create New Task"
3. Fill in task details
4. Assign to yourself
5. Save the task

### Test 3: Use Pomodoro Timer

1. Go to "Timer" page
2. Click "Start Timer"
3. Work for 25 minutes (or skip for testing)
4. Take a break when prompted

### Test 4: Desktop App Screenshot

1. Login to desktop app with same credentials
2. Verify "Screenshot Monitoring" shows "Active"
3. Screenshots will be captured every 5 minutes

## 🌐 Application URLs

When everything is running:

- **Frontend Web App:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **API Health Check:** http://localhost:5001/health

## 📱 User Roles

### Manager (You)

- **Full system access**
- **Team management**
- **Analytics and reports**
- **Task assignment**
- **Email communication**

### Team Members

- **Personal dashboard**
- **Task management**
- **Pomodoro timer**
- **Time tracking**
- **Profile management**

## 🔧 Common Issues & Solutions

### Issue: "Port already in use"

**Solution:**

```bash
# Kill processes on ports
netstat -ano | findstr :5001
taskkill /PID [PID_NUMBER] /F
```

### Issue: "MongoDB connection failed"

**Solution:**

1. Start MongoDB service
2. Check connection string in `backend/.env`
3. Verify MongoDB is running on port 27017

### Issue: "Email not working"

**Solution:**

- Email system uses test service by default
- Check console for preview URLs
- See [Email Setup Guide](./EMAIL_SETUP.md) for Gmail configuration

## 📚 Next Steps

Once your system is running:

1. **Read the [User Manual](./USER_MANUAL.md)** for detailed usage instructions
2. **Configure email** using [Email Setup Guide](./EMAIL_SETUP.md)
3. **Create team member accounts** through the Manager Dashboard
4. **Explore all features** and customize settings

## 🆘 Need Help?

If you encounter issues:

1. **Check the logs** in terminal windows
2. **Review [Troubleshooting Guide](./EMAIL_TROUBLESHOOTING.md)**
3. **Verify all prerequisites** are installed
4. **Check [FAQ](./README.md)** in docs folder

## 🎉 Success Checklist

- [ ] Backend server running on port 5001
- [ ] Frontend app accessible at localhost:3000
- [ ] Desktop app window opened
- [ ] Manager login successful
- [ ] Dashboard loads with data
- [ ] Email system functional (test emails)
- [ ] Task creation works
- [ ] Pomodoro timer functional

**Congratulations! Your Team Tracker system is ready to use! 🚀**

---

**Next:** Read the [User Manual](./USER_MANUAL.md) for detailed usage instructions.
