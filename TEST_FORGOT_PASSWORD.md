# 🧪 Test Forgot Password Feature - Quick Guide

## ⚡ Quick Setup (5 Minutes)

### Step 1: Generate Gmail App Password

1. **Open this link**: https://myaccount.google.com/apppasswords
   - Login with: `chinthagowrishankar18@gmail.com`

2. **If you see "App passwords" option**:
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (Custom name)"
   - Type: "Mini Social Media"
   - Click "Generate"
   - **Copy the 16-character password** (remove spaces)

3. **If you DON'T see "App passwords"**:
   - First enable 2-Step Verification: https://myaccount.google.com/signinoptions/two-step-verification
   - Follow the setup wizard
   - Then go back to step 2

### Step 2: Configure Server

1. **Open file**: `server/.env`

2. **Add your app password**:
   ```env
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   (Replace with your actual 16-character password, no spaces)

3. **Save the file**

### Step 3: Install Dependencies & Start Server

```bash
# Install dotenv if not already installed
cd server
npm install dotenv

# Start the server
npm start
```

**Expected output**:
```
✅ Connected to MongoDB
Server running on port 5000
```

### Step 4: Test the Feature

1. **Open browser**: http://localhost:5173/forgot-password

2. **Enter email**: `chinthagowrishankar18@gmail.com`

3. **Click "Send OTP"**
   - Should see: "OTP sent to your email successfully"

4. **Check email** (inbox or spam folder)
   - Subject: "Password Reset OTP"
   - Copy the 6-digit code

5. **Enter OTP** and click "Verify OTP"
   - Should see: "OTP verified successfully"

6. **Enter new password** and click "Reset Password"
   - Should see: "Password reset successful"
   - Redirected to login page

7. **Test login** with new password
   - Should work! ✅

---

## 🎯 Quick Troubleshooting

### "Failed to send OTP"

**Check**:
```bash
# In server terminal, look for error message
```

**Fix**:
- Verify `GMAIL_APP_PASSWORD` is set in `.env`
- Restart server after adding password
- Check 2FA is enabled on Gmail

### Email not received

**Check**:
- Spam/junk folder
- Wait 1-2 minutes
- Try again with "Send OTP"

### "Invalid or expired OTP"

**Fix**:
- Request new OTP (expires in 10 minutes)
- Check you copied the correct code
- Ensure no extra spaces

---

## ✅ Success Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App password generated
- [ ] `GMAIL_APP_PASSWORD` added to `server/.env`
- [ ] dotenv installed (`npm install dotenv`)
- [ ] Server restarted
- [ ] MongoDB running
- [ ] Frontend running on port 5173
- [ ] Backend running on port 5000

---

## 📧 Test Email Template

When successful, you'll receive:

```
From: chinthagowrishankar18@gmail.com
To: chinthagowrishankar18@gmail.com
Subject: Password Reset OTP

Password Reset OTP

You requested a password reset for your Mini Social Media account.

Your OTP is: 123456

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.
```

---

## 🔐 Security Notes

- OTP expires in 10 minutes
- Each OTP can only be used once
- Password is hashed with bcrypt
- App password is separate from Gmail password
- Never share your app password

---

## 💡 Pro Tips

1. **Test with your own email first** to verify it works
2. **Check spam folder** if email doesn't arrive in 2 minutes
3. **Keep app password secure** - it's like a password
4. **Use environment variables** - never hardcode passwords
5. **Restart server** after changing `.env` file

---

## 🚀 Ready to Test!

Your forgot password feature is **fully implemented** and ready to use!

Just:
1. ✅ Generate app password
2. ✅ Add to `.env`
3. ✅ Restart server
4. ✅ Test the flow

**That's it!** 🎉

---

## 📞 Need the App Password?

**Quick Link**: https://myaccount.google.com/apppasswords

**Requirements**:
- Gmail account: `chinthagowrishankar18@gmail.com`
- 2-Step Verification enabled
- 5 minutes of your time

---

**The feature is 100% ready - just needs the app password configuration!** ⚡
