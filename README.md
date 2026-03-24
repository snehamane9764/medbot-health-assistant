# 🏥 MedBot - Health Assistant Application

**Intelligent Health Assessment System with COVID-19 Detection**

A comprehensive health assistant application with CLI, web interface, and mobile app (iOS/Android) that provides preliminary health assessments and COVID-19 symptom detection ahead of mainstream AI chatbot adoption.

---

## 🌟 Features

### Core Functionality
- **Intelligent Symptom Analysis**: Rule-based symptom detection engine
- **COVID-19 Risk Assessment**: Detects likelihood of COVID-19 infection based on clinical symptom patterns
- **Multi-Platform Support**: CLI, Web (React), and Mobile (React Native - iOS/Android)
- **Automated Health Alerts**: Triggers alerts for high-risk cases
- **User Profile Management**: Track assessment history
- **Real-time Dashboard**: View system statistics and active alerts

### Technical Highlights
- **Backend**: Python Flask REST API with SQLite database
- **Web Frontend**: React with modern medical-themed UI
- **Mobile App**: React Native (Expo) for iOS and Android
- **CLI**: Rich terminal interface with color-coded output
- **Symptom Engine**: Categorized symptom analysis with severity weights

---

## 📁 Project Structure

```
medbot-health-assistant/
├── backend/                    # Flask API server
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   └── medbot.db             # SQLite database (auto-created)
│
├── web-frontend/              # React web application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS stylesheets
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json         # Node dependencies
│
├── mobile-app/               # React Native (Expo) app
│   ├── App.js               # Main mobile app
│   ├── package.json         # Dependencies
│   └── app.json            # Expo configuration
│
├── cli/                     # Command-line interface
│   └── medbot_cli.py       # CLI application
│
├── shared/                  # Shared logic
│   └── symptom_analyzer.py # Core symptom analysis engine
│
└── docs/                    # Documentation
    ├── SETUP_GUIDE.md      # Detailed setup instructions
    ├── API_DOCS.md         # API documentation
    └── GITHUB_UPLOAD.md    # GitHub upload guide
```

---

## 🚀 Quick Start (Mac M2)

### Prerequisites
You mentioned you have:
- ✅ Python 3 installed
- ✅ VS Code
- ✅ Visual Studio 2022
- ✅ Mac M2

### Installation Steps

See `docs/SETUP_GUIDE.md` for detailed step-by-step instructions.

**Quick version:**

1. **Backend Setup**
```bash
cd backend
pip3 install -r requirements.txt
python3 app.py
```

2. **CLI Usage**
```bash
cd cli
python3 medbot_cli.py
```

3. **Web Frontend Setup**
```bash
cd web-frontend
npm install
npm start
```

4. **Mobile App Setup**
```bash
cd mobile-app
npm install
npx expo start
```

---

## 🎯 Usage Examples

### CLI Interface
```bash
python3 medbot_cli.py
```
Interactive terminal interface with color-coded risk assessment.

### Web Interface
Visit `http://localhost:3000` after starting the React app.
- Create user profile
- Select symptoms
- Get instant COVID-19 risk assessment
- View assessment history

### Mobile App
Scan QR code with Expo Go app (iOS/Android) or run in simulator.

### API Endpoints
```bash
# Health check
GET http://localhost:5000/api/health

# Create user
POST http://localhost:5000/api/users

# Perform assessment
POST http://localhost:5000/api/assess

# Get statistics
GET http://localhost:5000/api/stats
```

---

## 🧪 Testing the Application

### Test Case 1: High COVID Risk
**Symptoms**: Fever, dry cough, loss of taste, fatigue  
**Temperature**: 101.5°F  
**Duration**: 3 days  
**Expected**: HIGH risk level, immediate care recommendation

### Test Case 2: Moderate Risk
**Symptoms**: Sore throat, headache, body aches  
**Temperature**: 99.5°F  
**Duration**: 2 days  
**Expected**: MODERATE risk level, telehealth recommendation

### Test Case 3: Minimal Risk
**Symptoms**: Mild headache  
**Temperature**: 98.6°F  
**Duration**: 1 day  
**Expected**: MINIMAL risk level, rest and monitor

---

## 🔧 Configuration

### Backend Configuration
- **Port**: 5000 (default)
- **Database**: SQLite (auto-created)
- **CORS**: Enabled for all origins

### Frontend Configuration
- **API URL**: `http://localhost:5000/api`
- **Port**: 3000 (React default)

### Mobile App Configuration
- **API URL**: Update in `App.js` for physical devices
- **Platform**: iOS/Android via Expo

---

## 📊 System Architecture

```
┌─────────────┐
│   Client    │ (CLI / Web / Mobile)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Flask API  │ (REST endpoints)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Symptom    │ (Analysis engine)
│  Analyzer   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   SQLite    │ (Data storage)
│  Database   │
└─────────────┘
```

---

## 🎨 UI/UX Design

### Color Palette
- **Primary**: #2c7fb1 (Medical blue)
- **Secondary**: #27ae60 (Health green)
- **Danger**: #e74c3c (Alert red)
- **Warning**: #f39c12 (Caution orange)

### Design Philosophy
- Clean, medical-themed interface
- Intuitive symptom selection
- Clear risk visualization
- Accessible color coding
- Responsive design for all devices

---

## 🔐 Security & Privacy

- **Data Storage**: Local SQLite database
- **API Security**: CORS enabled (configure for production)
- **Privacy**: No external data sharing
- **Disclaimer**: Clear medical disclaimer on all interfaces

---

## 📱 Mobile App Details

### iOS
- Compatible with iOS 13+
- Requires Expo Go app for development
- Can be built for App Store distribution

### Android
- Compatible with Android 5.0+
- Requires Expo Go app for development
- Can be built for Google Play distribution

---

## 🛠️ Development

### Adding New Symptoms
Edit `shared/symptom_analyzer.py`:
```python
COVID_SYMPTOMS = {
    'new_symptom': {'weight': 3, 'critical': True}
}
```

### Modifying Risk Thresholds
Adjust in `_calculate_covid_risk()` method:
```python
if risk_percentage >= 70:  # Adjust threshold
    risk_level = 'HIGH'
```

### Customizing UI
- **Web**: Edit CSS files in `web-frontend/src/styles/`
- **Mobile**: Modify styles in `mobile-app/App.js`

---

## 📝 License & Disclaimer

### Medical Disclaimer
**IMPORTANT**: This application provides preliminary health assessments only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.

### Development Status
This is a demonstration/educational project showcasing:
- Full-stack development skills
- Multi-platform application architecture
- Healthcare technology implementation
- REST API design
- Modern UI/UX practices

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For questions or issues:
1. Check `docs/SETUP_GUIDE.md` for detailed setup
2. Review `docs/API_DOCS.md` for API information
3. See `docs/GITHUB_UPLOAD.md` for upload instructions

---

## 🎓 Educational Value

This project demonstrates:
- **Backend Development**: Python, Flask, RESTful APIs, SQLite
- **Frontend Development**: React, modern CSS, responsive design
- **Mobile Development**: React Native, Expo, cross-platform apps
- **CLI Development**: Python terminal applications, ANSI colors
- **System Architecture**: Multi-tier application design
- **Healthcare Tech**: Medical assessment algorithms, symptom analysis
- **Data Management**: Database design, CRUD operations
- **API Integration**: Client-server communication, async operations

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Machine learning for improved diagnosis
- [ ] Integration with wearable devices
- [ ] Telemedicine video consultation
- [ ] Multi-language support
- [ ] Push notifications for alerts
- [ ] Data export/reporting features
- [ ] Integration with electronic health records
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for better health outcomes**

---

## 🔗 Quick Links

- [Setup Guide](docs/SETUP_GUIDE.md) - Detailed installation instructions
- [API Documentation](docs/API_DOCS.md) - Complete API reference
- [GitHub Upload Guide](docs/GITHUB_UPLOAD.md) - How to upload to GitHub

---

*Last Updated: 2024*
# medbot-health-assistant
