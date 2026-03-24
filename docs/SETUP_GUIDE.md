# 🚀 Complete Setup Guide for Mac M2

This guide will walk you through setting up and running the MedBot Health Assistant on your Mac M2 with Python 3, VS Code, and Visual Studio 2022.

---

## 📋 Prerequisites Check

Before starting, verify you have:
- ✅ Mac M2 (Apple Silicon)
- ✅ Python 3 installed
- ✅ VS Code installed
- ✅ Visual Studio 2022 installed (for advanced development)

---

## 🔍 Step 1: Verify Python Installation

Open Terminal and check your Python version:

```bash
python3 --version
```

Expected output: `Python 3.x.x` (should be 3.8 or higher)

If Python is not installed or version is too old:
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3
brew install python3
```

---

## 🔍 Step 2: Verify pip Installation

```bash
pip3 --version
```

If pip is not installed:
```bash
python3 -m ensurepip --upgrade
```

---

## 📦 Step 3: Install Node.js and npm

Node.js is required for the React web frontend and React Native mobile app.

### Check if Node.js is installed:
```bash
node --version
npm --version
```

### If not installed:
```bash
# Install Node.js using Homebrew
brew install node

# Verify installation
node --version  # Should be v18.x or higher
npm --version   # Should be 9.x or higher
```

---

## 🏗️ Step 4: Project Setup

### Navigate to the project directory
```bash
# Assuming you extracted/cloned to your Downloads folder
cd ~/Downloads/medbot-health-assistant

# Or navigate to wherever you placed the project
```

---

## 🖥️ Step 5: Backend Setup (Flask API)

### 5.1 Navigate to backend directory
```bash
cd backend
```

### 5.2 Create a virtual environment (RECOMMENDED)
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# You should see (venv) prefix in your terminal
```

### 5.3 Install Python dependencies
```bash
pip3 install -r requirements.txt
```

Expected packages:
- Flask==3.0.0
- Flask-CORS==4.0.0

### 5.4 Test the backend
```bash
python3 app.py
```

**Expected output:**
```
🏥 MedBot API Server Starting...
📡 Server running on http://localhost:5000
📚 API Documentation:
  - GET  /api/health - Health check
  - POST /api/users - Create user
  ...
 * Running on http://0.0.0.0:5000
```

### 5.5 Test the API
Open a new Terminal tab (keep the server running) and test:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "MedBot API",
  "version": "1.0.0",
  "timestamp": "2024-..."
}
```

✅ **Backend is working!** Keep the server running for the next steps.

---

## 💻 Step 6: CLI Setup (Command Line Interface)

### 6.1 Open a new Terminal tab
```bash
cd ~/Downloads/medbot-health-assistant/cli
```

### 6.2 Run the CLI application
```bash
python3 medbot_cli.py
```

You should see the colorful MedBot header and interactive prompts.

### 6.3 Test the CLI
Follow the prompts:
1. Enter your name, age, gender
2. Select symptoms (use comma-separated numbers)
3. Enter temperature and duration
4. View your health assessment

✅ **CLI is working!**

---

## 🌐 Step 7: Web Frontend Setup (React)

### 7.1 Navigate to web frontend directory
```bash
cd ~/Downloads/medbot-health-assistant/web-frontend
```

### 7.2 Install npm dependencies
```bash
npm install
```

This will install:
- React 18.2.0
- React Router DOM
- Axios
- React Scripts

**Note**: This may take 2-5 minutes on first install.

### 7.3 Start the development server
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view medbot-web in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Your default browser should automatically open to `http://localhost:3000`

### 7.4 Test the web interface
1. You should see the MedBot header with navigation
2. Click "Symptom Checker"
3. Fill in your information
4. Select symptoms
5. Get assessment

✅ **Web frontend is working!**

---

## 📱 Step 8: Mobile App Setup (React Native - Optional)

### 8.1 Install Expo CLI globally
```bash
npm install -g expo-cli
```

### 8.2 Navigate to mobile app directory
```bash
cd ~/Downloads/medbot-health-assistant/mobile-app
```

### 8.3 Install dependencies
```bash
npm install
```

### 8.4 Start Expo development server
```bash
npx expo start
```

**Expected output:**
```
Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 8.5 Test on physical device

**For iOS (iPhone/iPad):**
1. Install "Expo Go" from App Store
2. Open Camera app
3. Scan the QR code
4. App opens in Expo Go

**For Android:**
1. Install "Expo Go" from Google Play
2. Open Expo Go app
3. Scan QR code from app
4. App opens in Expo Go

### 8.6 Test in iOS Simulator (Optional)
```bash
# Press 'i' in the Expo terminal to open iOS simulator
# Requires Xcode to be installed
```

### 8.7 Test in Android Emulator (Optional)
```bash
# Press 'a' in the Expo terminal to open Android emulator
# Requires Android Studio to be installed
```

✅ **Mobile app is working!**

---

## 🎯 Step 9: Opening in VS Code

### 9.1 Open entire project in VS Code
```bash
cd ~/Downloads/medbot-health-assistant
code .
```

### 9.2 Recommended VS Code Extensions
Install these for better development experience:
- Python (Microsoft)
- Pylance
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- SQLite Viewer

### 9.3 VS Code Terminal Usage
You can run all commands from VS Code's integrated terminal:
- Press `` Ctrl+` `` or `Cmd+` ` to open terminal
- Use split terminal to run multiple processes

**Example terminal layout:**
- Terminal 1: Backend server (`cd backend && python3 app.py`)
- Terminal 2: Web frontend (`cd web-frontend && npm start`)
- Terminal 3: Mobile app (`cd mobile-app && npx expo start`)

---

## 🔧 Step 10: Common Issues & Solutions

### Issue 1: Port already in use
**Error**: `Address already in use: Port 5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
python3 app.py --port 5001
```

### Issue 2: Module not found errors
**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip3 install -r requirements.txt
```

### Issue 3: npm install fails
**Error**: Various npm errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: React app won't start
**Error**: `Error: ENOSPC: System limit for number of file watchers reached`

**Solution:**
```bash
# Increase file watchers limit (Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue 5: CORS errors in browser
**Error**: `Access-Control-Allow-Origin error`

**Solution:**
- Backend is not running - start Flask server
- Check API_URL in frontend matches backend URL
- Clear browser cache and restart

### Issue 6: Database locked
**Error**: `database is locked`

**Solution:**
```bash
# Stop all Flask processes
pkill -f "python3 app.py"

# Delete database (will be recreated)
rm backend/medbot.db

# Restart server
python3 app.py
```

---

## 🧪 Step 11: Testing Your Setup

### Full System Test

1. **Backend Test**
```bash
# Terminal 1
cd backend
source venv/bin/activate
python3 app.py
```

2. **CLI Test**
```bash
# Terminal 2
cd cli
python3 medbot_cli.py
```
- Enter test data
- Verify symptom analysis works

3. **Web Test**
```bash
# Terminal 3
cd web-frontend
npm start
```
- Visit http://localhost:3000
- Create a user
- Perform assessment
- Check dashboard

4. **API Test**
```bash
# Terminal 4 - Test all endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/symptoms/categories
curl http://localhost:5000/api/stats
```

All tests passing? ✅ **Your setup is complete!**

---

## 📊 Step 12: Understanding the Workflow

### Typical Usage Flow:

```
1. Start Backend
   ↓
2. Backend initializes database
   ↓
3. Start Web/Mobile frontend
   ↓
4. User enters information
   ↓
5. User selects symptoms
   ↓
6. Frontend sends to API
   ↓
7. Backend analyzes symptoms
   ↓
8. Returns assessment
   ↓
9. Frontend displays results
   ↓
10. Data saved to database
```

---

## 🎓 Step 13: Development Tips

### Best Practices:

1. **Always activate virtual environment** before working on backend
```bash
cd backend
source venv/bin/activate
```

2. **Keep backend running** when testing frontend
```bash
# Backend must run for frontend to work
```

3. **Use VS Code split terminal** for multiple processes
```bash
# More efficient than multiple Terminal windows
```

4. **Check console for errors** in browser DevTools
```bash
# Press F12 or Cmd+Option+I
```

5. **Monitor backend logs** for API errors
```bash
# Watch Flask terminal for error messages
```

---

## 🛠️ Step 14: Optional Tools

### Database Viewer
```bash
# Install DB Browser for SQLite
brew install --cask db-browser-for-sqlite

# Open database
open backend/medbot.db
```

### API Testing Tool
```bash
# Install Postman
brew install --cask postman

# Or use curl for simple tests
```

### React Developer Tools
Install browser extension:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

---

## 📝 Step 15: Running Multiple Components Simultaneously

### Option 1: Multiple Terminal Tabs
```bash
# Tab 1: Backend
cd backend && source venv/bin/activate && python3 app.py

# Tab 2: Web Frontend
cd web-frontend && npm start

# Tab 3: Mobile App
cd mobile-app && npx expo start
```

### Option 2: VS Code Integrated Terminal
1. Open VS Code
2. Open terminal (`` Cmd+` ``)
3. Split terminal (click + icon or Cmd+\)
4. Run each component in separate pane

### Option 3: Create Launch Script
```bash
# Create start.sh in project root
#!/bin/bash
cd backend && source venv/bin/activate && python3 app.py &
cd web-frontend && npm start &
wait
```

---

## ✅ Final Verification Checklist

- [ ] Python 3 installed and working
- [ ] pip3 working
- [ ] Node.js and npm installed
- [ ] Backend runs without errors
- [ ] CLI works and shows colored output
- [ ] Web frontend loads at localhost:3000
- [ ] Can create user and perform assessment
- [ ] API endpoints responding
- [ ] Database created successfully
- [ ] VS Code opens project correctly
- [ ] Mobile app runs in Expo (optional)

**All checked?** 🎉 **You're ready to use MedBot!**

---

## 🚀 Next Steps

1. Review `README.md` for feature overview
2. Check `docs/API_DOCS.md` for API details
3. Read `docs/GITHUB_UPLOAD.md` to upload your project
4. Start developing or demonstrating the application!

---

## 💡 Pro Tips

1. **Bookmark localhost URLs**
   - http://localhost:5000 (API)
   - http://localhost:3000 (Web)

2. **Use VS Code workspace**
   - File → Save Workspace As → medbot.code-workspace

3. **Git ignore virtual env**
   - Already configured in .gitignore

4. **Monitor resource usage**
   - Activity Monitor → check Python/Node processes

5. **Regular testing**
   - Test after each code change
   - Verify all three interfaces work

---

**Need Help?** Check the troubleshooting section or review error messages carefully. Most issues are related to:
- Missing dependencies (run install commands again)
- Port conflicts (change ports or kill processes)
- Virtual environment not activated (backend only)
- Backend not running (frontend needs it)

**Happy Coding! 🏥💻**
