# 📧 Email System Troubleshooting Guide

## 🔍 Current Status

Your email system is **WORKING** but using test email service instead of real Gmail delivery.

### ✅ What's Working:
- Email service is properly configured
- Test emails are being sent successfully
- Email templates are rendering correctly
- All email endpoints are functional

### ⚠️ What Needs Fixing:
- Gmail SMTP authentication is failing
- Real emails are not being delivered to actual inboxes

---

## 🛠️ Quick Fix Options

### Option 1: Use Test Email Service (Recommended for Development)
**Current Status**: ✅ Already Working

The system is currently using Ethereal Email (test service) which:
- ✅ Sends emails successfully
- ✅ Provides preview URLs to view emails
- ✅ Perfect for development and testing
- ❌ Emails don't reach real inboxes

**How to view test emails:**
1. Check console output for preview URLs
2. Visit: https://ethereal.email
3. Use the preview URL to see the email content

### Option 2: Fix Gmail Configuration (For Production)
**Current Status**: ❌ Authentication Failed

To send real emails to actual inboxes, fix Gmail setup:

#### Step 1: Verify Gmail Account Setup
1. **Enable 2-Factor Authentication**:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Copy the 16-character password (example: `abcd efgh ijkl mnop`)

#### Step 2: Update Configuration
Run the email configuration tool:
```bash
cd backend
node fix-email-config.js
```

Or manually update `backend/.env`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your16characterapppassword
FROM_EMAIL=your-email@gmail.com
```

#### Step 3: Test Configuration
```bash
cd backend
node -e "
const emailService = require('./services/emailService');
require('dotenv').config();
emailService.sendWelcomeEmail({
  firstName: 'Test',
  lastName: 'User', 
  email: 'your-email@gmail.com'
}).then(result => console.log('Result:', result));
"
```

---

## 🧪 Testing Email Functionality

### Test 1: Welcome Email
```bash
cd backend
node -e "
const emailService = require('./services/emailService');
require('dotenv').config();
emailService.sendWelcomeEmail({
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com'
}).then(console.log);
"
```

### Test 2: Team Announcement (via Web App)
1. Login as manager: `dhchaudhary973@gmail.com` / `dhp@973`
2. Go to Manager Dashboard
3. Find "Team Communication" section
4. Send test announcement
5. Check console for preview URL or inbox for real email

### Test 3: User Invitation
```bash
curl -X POST http://localhost:5001/api/email/user-invitation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User",
    "role": "team_member",
    "tempPassword": "temp123456"
  }'
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Username and Password not accepted"
**Cause**: Invalid Gmail App Password
**Solution**:
1. Regenerate App Password at https://myaccount.google.com/apppasswords
2. Ensure 2FA is enabled
3. Use App Password, not regular Gmail password
4. Remove all spaces from App Password

### Issue 2: "Less secure app access"
**Cause**: Trying to use regular password instead of App Password
**Solution**: Always use App Password for SMTP authentication

### Issue 3: Emails not appearing in inbox
**Cause**: Using test email service
**Solution**: 
- For development: Check Ethereal preview URLs
- For production: Fix Gmail configuration

### Issue 4: "Connection timeout"
**Cause**: Network or firewall issues
**Solution**:
1. Check internet connection
2. Verify firewall allows SMTP (port 587)
3. Try different network if on corporate firewall

---

## 📊 Email Service Status Check

### Check Current Configuration:
```bash
cd backend
node -e "
require('dotenv').config();
console.log('Gmail User:', process.env.GMAIL_USER || 'NOT SET');
console.log('Gmail Pass:', process.env.GMAIL_PASS ? 'CONFIGURED' : 'NOT SET');
console.log('From Email:', process.env.FROM_EMAIL || 'NOT SET');
"
```

### Check Service Status:
```bash
cd backend
node -e "
const emailService = require('./services/emailService');
require('dotenv').config();
setTimeout(() => {
  console.log('Email service initialized');
  console.log('Transporter ready:', !!emailService.transporter);
}, 2000);
"
```

---

## 🎯 Recommended Actions

### For Development/Testing:
1. ✅ **Keep current setup** - test emails are working perfectly
2. ✅ Use preview URLs to view email content
3. ✅ Test all email features using Ethereal service

### For Production:
1. 🔧 Fix Gmail App Password configuration
2. 🧪 Test with real email addresses
3. 📧 Verify emails reach actual inboxes
4. 🔒 Secure email credentials properly

---

## 📞 Support

If you continue having issues:

1. **Check Gmail Account**:
   - Verify 2FA is enabled
   - Regenerate App Password
   - Test with different Gmail account

2. **Alternative Email Providers**:
   - Consider using SendGrid, Mailgun, or AWS SES
   - Update SMTP configuration accordingly

3. **Network Issues**:
   - Test from different network
   - Check corporate firewall settings
   - Verify DNS resolution

**Current Status**: Email system is functional with test service. Gmail configuration needs fixing for production use.
