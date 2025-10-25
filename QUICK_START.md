# 🚀 Quick Start Guide - Mini Social Media

Get your professional social media platform up and running in minutes!

---

## ⚡ Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## 📦 Installation

### 1. Clone or Navigate to Project
```bash
cd "c:\msm\mini social media"
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies (if separate)
cd server
npm install
cd ..
```

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create Account** at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to Database Access
   - Add New Database User
   - Username: `admin`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database

4. **Whitelist IP Address**
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0`

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

### Option 2: Local MongoDB

1. **Install MongoDB** from [mongodb.com/try/download/community](https://mongodb.com/try/download/community)

2. **Start MongoDB**
   ```bash
   # Windows
   mongod --dbpath="C:\data\db"
   
   # Mac/Linux
   mongod --dbpath=/data/db
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/minisocial
   ```

---

## ⚙️ Environment Configuration

### Backend Environment (.env in server folder)

Create `server/.env`:
```env
# Database
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/minisocial?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment (.env in root folder)

Create `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🎨 What's Already Done

Your application now has:

✅ **Professional Design**
- Instagram/Twitter/WhatsApp inspired color schemes
- Modern glass morphism effects
- Smooth animations and transitions
- Fully responsive layouts

✅ **SEO Optimization**
- Complete meta tags
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- PWA manifest

✅ **Enhanced Pages**
- Login page with purple gradient
- Signup page with Instagram gradient buttons
- Forgot password with step indicators
- Dashboard with collapsible sidebar
- User profile with wall posts
- Messaging with WhatsApp theme
- Search with animated results
- Posts feed with engagement features
- Friend requests with action buttons

✅ **Performance**
- Optimized CSS with variables
- GPU-accelerated animations
- Lazy loading ready
- Code splitting ready

---

## 🏃 Running the Application

### Development Mode

#### Terminal 1 - Backend Server
```bash
cd server
npm start
# or
node server.js
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

#### Terminal 2 - Frontend Development Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v7.1.2  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🎯 First Steps After Launch

### 1. Create Your First Account
- Click "Get Started" on landing page
- Fill in signup form
- Upload a profile picture (optional)
- Click "Sign Up"

### 2. Explore the Dashboard
- View the modern sidebar
- Navigate through different sections
- Hover over sidebar to see full menu

### 3. Create Your First Post
- Go to "Posts" or "Upload Photos"
- Select an image
- Add a caption
- Click "Post"

### 4. Connect with Others
- Go to "Search Users"
- Search for users
- Send friend requests

### 5. Start Messaging
- Go to "Messages"
- Select a friend
- Start chatting!

---

## 🔧 Troubleshooting

### Port Already in Use

**Frontend (5173):**
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

**Backend (5000):**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed

1. **Check connection string** in `.env`
2. **Verify IP whitelist** in MongoDB Atlas
3. **Check username/password** are correct
4. **Test connection** using MongoDB Compass

### CORS Errors

1. **Check FRONTEND_URL** in backend `.env`
2. **Verify backend is running** on port 5000
3. **Check VITE_API_URL** in frontend `.env`

### Images Not Loading

1. **Check uploads folder** exists in server directory
2. **Verify multer configuration** in backend
3. **Check file permissions** on uploads folder

---

## 📱 Testing on Mobile

### Using Your Phone on Same Network

1. **Find your computer's IP address**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address
   
   # Mac/Linux
   ifconfig
   # Look for inet address
   ```

2. **Update Vite config** to expose network
   ```bash
   npm run dev -- --host
   ```

3. **Access from phone**
   ```
   http://YOUR-IP-ADDRESS:5173
   ```

---

## 🎨 Customization

### Change Primary Colors

Edit `src/index.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #YOUR-COLOR-1 0%, #YOUR-COLOR-2 100%);
  /* Update other color variables */
}
```

### Change Logo

Replace logo icon in:
- `src/pages/DashBoard.jsx` (logo-icon class)
- Update emoji or add image

### Update Site Name

1. **index.html** - Update `<title>` tag
2. **manifest.json** - Update `name` and `short_name`
3. **Dashboard** - Update logo text

---

## 📊 Monitoring & Debugging

### Browser DevTools

**F12** or **Right-click → Inspect**

- **Console**: View errors and logs
- **Network**: Monitor API calls
- **Application**: Check localStorage
- **Performance**: Analyze load times

### Backend Logs

Watch server terminal for:
- API requests
- Database queries
- Error messages
- Connection status

---

## 🚀 Production Build

### Build Frontend
```bash
npm run build
```

**Output**: `dist` folder with optimized files

### Test Production Build Locally
```bash
npm run preview
```

---

## 📚 Useful Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

### Backend
```bash
npm start            # Start server
npm run dev          # Start with nodemon (auto-reload)
```

---

## 🎯 Next Steps

1. **Customize Content**
   - Update landing page text
   - Add your own images
   - Modify feature descriptions

2. **Configure Email**
   - Set up Gmail app password
   - Test password reset flow

3. **Add More Features**
   - Implement notifications
   - Add dark mode
   - Create admin panel

4. **Prepare for Deployment**
   - Read `DEPLOYMENT_GUIDE.md`
   - Set up production database
   - Configure domain and hosting

---

## 📖 Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **COLOR_SCHEME_GUIDE.md** - Color palette reference
- **FEATURES_OVERVIEW.md** - All features explained
- **README.md** - Project overview

---

## 💡 Tips for Success

### Performance
- Keep images under 1MB
- Use WebP format when possible
- Enable lazy loading for images
- Monitor bundle size

### Security
- Never commit `.env` files
- Use strong JWT secrets
- Implement rate limiting
- Validate all inputs

### User Experience
- Test on multiple devices
- Get feedback from users
- Monitor error rates
- Optimize load times

---

## 🆘 Getting Help

### Common Issues

**"Cannot find module"**
```bash
npm install
```

**"Port already in use"**
- Change port in `.env` or kill process

**"MongoDB connection error"**
- Check connection string
- Verify network access

**"CORS error"**
- Check FRONTEND_URL in backend `.env`

---

## 🎉 You're Ready!

Your professional social media platform is now running with:

✨ **Beautiful Design** - Modern, responsive, animated
🔍 **SEO Optimized** - Ready for search engines
⚡ **High Performance** - Fast and efficient
🔒 **Secure** - Industry-standard security
📱 **Mobile-Friendly** - Works on all devices

**Start building your community!** 🚀

---

**Need help?** Check the documentation or review the code comments for guidance.

**Happy coding!** 💻✨
