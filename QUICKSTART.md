# ⚡ Quick Start Guide - Mac M2

Get MedBot running in 5 minutes!

---

## 🚀 Fastest Way to Start

### Option 1: Use the Start Script (Recommended)

```bash
cd medbot-health-assistant
./start.sh
```

Choose option **4** (Backend + Web Frontend) and you're done!

---

## 📝 Manual Setup (Step-by-Step)

### 1. Install Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 app.py
```

✅ Backend now running on http://localhost:5000

### 2. Test CLI (New Terminal)

```bash
cd cli
python3 medbot_cli.py
```

✅ CLI working!

### 3. Install Web Frontend (New Terminal)

```bash
cd web-frontend
npm install
npm start
```

✅ Web app now running on http://localhost:3000

---

## 🎯 What You Need

- ✅ Python 3 (you have it)
- ✅ Node.js ([Install](https://nodejs.org/) if needed)
- ✅ npm (comes with Node.js)

Check versions:
```bash
python3 --version  # Should be 3.8+
node --version     # Should be 18+
npm --version      # Should be 9+
```

---

## 🧪 Quick Test

### 1. Test Backend
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"healthy"...}`

### 2. Test Web App
Open browser: http://localhost:3000
- Fill in your info
- Select symptoms
- Get assessment

---

## 📱 Mobile App (Optional)

```bash
cd mobile-app
npm install
npx expo start
```

Scan QR with Expo Go app on your phone.

---

## 🆘 Having Issues?

### Backend won't start?
```bash
# Make sure you're in venv
source venv/bin/activate

# Reinstall
pip3 install -r requirements.txt
```

### Web won't start?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port in use?
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

---

## 📚 Full Documentation

- [Complete Setup Guide](docs/SETUP_GUIDE.md) - Detailed instructions
- [API Documentation](docs/API_DOCS.md) - API reference
- [GitHub Upload](docs/GITHUB_UPLOAD.md) - Upload to GitHub

---

## ✅ Success Checklist

After setup, you should have:
- [ ] Backend running on http://localhost:5000
- [ ] CLI working with colorful output
- [ ] Web app on http://localhost:3000
- [ ] Can create user and perform assessment
- [ ] Dashboard shows statistics

---

## 🎉 You're Ready!

**Web Interface:** http://localhost:3000
**API Endpoint:** http://localhost:5000/api

Start assessing symptoms!

---

**Next Steps:**
1. Try the application
2. Read full documentation
3. Upload to GitHub (see docs/GITHUB_UPLOAD.md)

**Questions?** Check docs/SETUP_GUIDE.md for detailed help.
