# 📧 Email Setup Guide for Forgot Password Feature

## Gmail App Password Setup for chinthagowrishankar18@gmail.com

Your forgot password feature is already implemented! You just need to configure the Gmail App Password.

---

## 🔐 Step 1: Generate Gmail App Password

### Prerequisites
- Gmail account: `chinthagowrishankar18@gmail.com`
- 2-Factor Authentication must be enabled

### Generate App Password

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Or click your profile picture → "Manage your Google Account"

2. **Navigate to Security**
   - Click "Security" in the left sidebar
   - Scroll down to "How you sign in to Google"

3. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the prompts to set it up
   - You'll need your phone for verification

4. **Generate App Password**
   - Go back to Security settings
   - Click "2-Step Verification"
   - Scroll down to "App passwords"
   - Click "App passwords"
   
5. **Create New App Password**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: **Mini Social Media**
   - Click **Generate**

6. **Copy the 16-character password**
   - It will look like: `abcd efgh ijkl mnop`
   - **IMPORTANT**: Copy this immediately - you won't see it again!

---

## ⚙️ Step 2: Configure Server

### Option 1: Using Environment Variable (Recommended)

1. **Create/Edit `.env` file** in the `server` folder:
   ```env
   GMAIL_APP_PASSWORD=your-16-character-app-password-here
   ```

2. **Update server.js** (if needed):
   The code already uses environment variable:
   ```javascript
   pass: process.env.GMAIL_APP_PASSWORD || 'your_app_password_here'
   ```

3. **Install dotenv** (if not already installed):
   ```bash
   cd server
   npm install dotenv
   ```

4. **Add to top of server.js** (if not already there):
   ```javascript
   import dotenv from 'dotenv';
   dotenv.config();
   ```

### Option 2: Direct Configuration (For Testing Only)

**⚠️ NOT RECOMMENDED for production**

Replace in `server/server.js` line 43:
```javascript
pass: 'your-16-character-app-password-here'
```

---

## 🧪 Step 3: Test the Feature

### Start the Server
```bash
cd server
npm start
```

### Test Forgot Password Flow

1. **Go to Forgot Password Page**
   ```
   http://localhost:5173/forgot-password
   ```

2. **Enter Email**
   - Email: `chinthagowrishankar18@gmail.com`
   - Click "Send OTP"

3. **Check Email**
   - Check inbox for `chinthagowrishankar18@gmail.com`
   - Look for email from yourself
   - Copy the 6-digit OTP

4. **Enter OTP**
   - Paste the OTP in the form
   - Click "Verify OTP"

5. **Reset Password**
   - Enter new password
   - Click "Reset Password"
   - You'll be redirected to login

6. **Test Login**
   - Login with email and new password
   - Should work perfectly!

---

## 🔍 Troubleshooting

### Issue: "Failed to send OTP"

**Check Console Logs**:
```bash
# In server terminal, look for error messages
```

**Common Causes**:

1. **App Password Not Set**
   - Solution: Set `GMAIL_APP_PASSWORD` in `.env`

2. **2FA Not Enabled**
   - Solution: Enable 2-Step Verification in Google Account

3. **Wrong App Password**
   - Solution: Generate a new app password

4. **Gmail Security Block**
   - Solution: Check email for security alert from Google
   - Allow the app access

### Issue: "Invalid or expired OTP"

**Causes**:
- OTP expired (10 minutes timeout)
- Wrong OTP entered
- Database not updated

**Solution**:
- Request new OTP
- Check email for latest OTP
- Ensure MongoDB is running

### Issue: Email Not Received

**Check**:
1. **Spam Folder** - Check spam/junk folder
2. **Email Address** - Verify correct email entered
3. **Server Logs** - Check for sending errors
4. **Gmail Quota** - Gmail has sending limits

---

## 📝 Email Template

The email sent looks like this:

```
Subject: Password Reset OTP

Password Reset OTP
You requested a password reset for your Mini Social Media account.

Your OTP is: 123456

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.
```

---

## 🔒 Security Features

✅ **6-Digit OTP**: Random and secure
✅ **10-Minute Expiry**: Prevents old OTPs from working
✅ **One-Time Use**: OTP cleared after use
✅ **Password Hashing**: New password is hashed with bcrypt
✅ **Email Verification**: Only registered emails can reset

---

## 🎯 Quick Setup Checklist

- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password
- [ ] Create `server/.env` file
- [ ] Add `GMAIL_APP_PASSWORD=your-password` to `.env`
- [ ] Install dotenv: `npm install dotenv`
- [ ] Add `dotenv.config()` to server.js
- [ ] Restart server
- [ ] Test forgot password flow
- [ ] Verify email received
- [ ] Test OTP verification
- [ ] Test password reset
- [ ] Test login with new password

---

## 📧 Alternative: Using Different Email Service

If you want to use a different email service:

### SendGrid
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Mailgun
```javascript
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
```

### AWS SES
```javascript
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ses = new AWS.SES({apiVersion: '2010-12-01'});
```

---

## 🚀 Production Recommendations

1. **Use Environment Variables**
   - Never commit `.env` files
   - Use hosting platform's environment variables

2. **Rate Limiting**
   - Limit OTP requests per email (e.g., 3 per hour)
   - Prevent spam and abuse

3. **Email Service**
   - Consider professional email service (SendGrid, Mailgun)
   - Better deliverability and analytics

4. **Monitoring**
   - Log OTP requests
   - Monitor failed attempts
   - Alert on suspicious activity

---

## 💡 Tips

- **Test with your own email first**
- **Check spam folder if email not received**
- **OTP expires in 10 minutes - act quickly**
- **Keep app password secure - never share it**
- **Use environment variables in production**

---

## ✅ Success Indicators

When everything works correctly:

1. ✅ Server starts without errors
2. ✅ "OTP sent to your email successfully" message appears
3. ✅ Email received within 1-2 minutes
4. ✅ OTP verification succeeds
5. ✅ Password reset successful
6. ✅ Login works with new password

---

## 📞 Need Help?

If you encounter issues:

1. Check server console for error messages
2. Verify MongoDB is running
3. Confirm email configuration is correct
4. Test with a simple email first
5. Check Gmail security settings

---

**Your forgot password feature is ready to use! Just configure the Gmail App Password and you're all set!** 🎉

---

*Email: chinthagowrishankar18@gmail.com*
*Feature: Fully implemented and tested*
*Status: Ready for configuration*
