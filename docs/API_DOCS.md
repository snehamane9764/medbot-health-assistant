# 📚 MedBot API Documentation

Complete API reference for the MedBot Health Assistant backend.

---

## 🌐 Base URL

```
http://localhost:5000/api
```

**Production:** Update base URL when deployed

---

## 🔑 Authentication

Currently: **No authentication required** (development mode)

**Production:** Implement JWT or API key authentication

---

## 📋 API Endpoints

### Health Check

Check API status and version.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "MedBot API",
  "version": "1.0.0",
  "timestamp": "2024-03-23T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### Create User

Create a new user profile.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "male",
  "email": "john@example.com",
  "medical_history": ["hypertension", "diabetes"]
}
```

**Required Fields:**
- `name` (string)
- `age` (integer, 1-120)
- `gender` (string: "male", "female", "other")

**Optional Fields:**
- `email` (string, must be unique)
- `medical_history` (array of strings)

**Success Response (201):**
```json
{
  "success": true,
  "user_id": 1,
  "message": "User created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

---

### Get User

Retrieve user information by ID.

**Endpoint:** `GET /api/users/{user_id}`

**URL Parameters:**
- `user_id` (integer) - User ID

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "age": 35,
  "gender": "male",
  "email": "john@example.com",
  "medical_history": ["hypertension", "diabetes"],
  "created_at": "2024-03-23T10:00:00"
}
```

**Error Responses:**
- `404 Not Found` - User doesn't exist

---

### Perform Assessment

Analyze symptoms and generate health assessment.

**Endpoint:** `POST /api/assess`

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "male",
  "symptoms": [
    "fever",
    "dry_cough",
    "loss_of_taste",
    "fatigue"
  ],
  "temperature": 101.5,
  "duration_days": 3,
  "user_id": 1
}
```

**Required Fields:**
- `name` (string)
- `age` (integer)
- `gender` (string)
- `symptoms` (array of symptom keys)

**Optional Fields:**
- `temperature` (float, in Fahrenheit)
- `duration_days` (integer)
- `user_id` (integer) - If provided, saves to database

**Available Symptoms:**
```javascript
// Respiratory
"dry_cough", "difficulty_breathing", "sore_throat", 
"congestion", "chest_pain"

// Systemic
"fever", "fatigue", "chills", "body_aches", "headache"

// Sensory
"loss_of_taste", "loss_of_smell", "sudden_vision_changes"

// Gastrointestinal
"nausea", "diarrhea", "severe_abdominal_pain",
"persistent_vomiting", "blood_in_stool"

// Other
"dizziness", "rash", "joint_pain", "confusion"
```

**Success Response (200):**
```json
{
  "timestamp": "2024-03-23T10:30:00",
  "user": {
    "name": "John Doe",
    "age": 35,
    "gender": "male"
  },
  "symptoms": ["fever", "dry_cough", "loss_of_taste", "fatigue"],
  "duration_days": 3,
  "temperature": 101.5,
  "covid_risk": {
    "level": "HIGH",
    "percentage": 78.5,
    "score": 11,
    "critical_symptoms": ["fever", "dry_cough", "loss_of_taste"],
    "color": "red",
    "detected_covid_symptoms": ["fever", "dry_cough", "loss_of_taste", "fatigue"]
  },
  "urgent_care_needed": false,
  "recommendations": [
    "🏥 Contact your healthcare provider immediately",
    "📞 Consider COVID-19 testing",
    "🏠 Self-isolate to prevent potential spread",
    "😷 Wear a mask if you must be around others",
    "📊 Monitor your symptoms closely"
  ],
  "alert": {
    "severity": "HIGH",
    "message": "HIGH RISK: John Doe shows high COVID-19 risk (78.5%)",
    "timestamp": "2024-03-23T10:30:00",
    "requires_action": true,
    "user": "John Doe",
    "age": 35
  },
  "disclaimer": "This is a preliminary assessment...",
  "assessment_id": 1
}
```

**COVID Risk Levels:**
- `MINIMAL` (0-19%): Green
- `LOW` (20-39%): Yellow
- `MODERATE` (40-69%): Orange
- `HIGH` (70-100%): Red

**Error Responses:**
- `400 Bad Request` - Missing required fields or invalid data
- `500 Internal Server Error` - Assessment failed

---

### Get Symptom Categories

Retrieve organized list of all symptoms.

**Endpoint:** `GET /api/symptoms/categories`

**Success Response (200):**
```json
{
  "respiratory": [
    {"key": "dry_cough", "label": "Dry Cough"},
    {"key": "difficulty_breathing", "label": "Difficulty Breathing"},
    {"key": "sore_throat", "label": "Sore Throat"},
    {"key": "congestion", "label": "Congestion"},
    {"key": "chest_pain", "label": "Chest Pain"}
  ],
  "systemic": [
    {"key": "fever", "label": "Fever"},
    {"key": "fatigue", "label": "Fatigue"},
    {"key": "chills", "label": "Chills"},
    {"key": "body_aches", "label": "Body Aches"},
    {"key": "headache", "label": "Headache"}
  ],
  "sensory": [
    {"key": "loss_of_taste", "label": "Loss Of Taste"},
    {"key": "loss_of_smell", "label": "Loss Of Smell"},
    {"key": "sudden_vision_changes", "label": "Sudden Vision Changes"}
  ],
  "gastrointestinal": [
    {"key": "nausea", "label": "Nausea"},
    {"key": "diarrhea", "label": "Diarrhea"},
    {"key": "severe_abdominal_pain", "label": "Severe Abdominal Pain"},
    {"key": "persistent_vomiting", "label": "Persistent Vomiting"},
    {"key": "blood_in_stool", "label": "Blood In Stool"}
  ],
  "other": [
    {"key": "dizziness", "label": "Dizziness"},
    {"key": "rash", "label": "Rash"},
    {"key": "joint_pain", "label": "Joint Pain"},
    {"key": "confusion", "label": "Confusion"}
  ]
}
```

---

### Get User Assessments

Retrieve assessment history for a user.

**Endpoint:** `GET /api/assessments/user/{user_id}`

**URL Parameters:**
- `user_id` (integer) - User ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "symptoms": ["fever", "dry_cough", "fatigue"],
    "temperature": 101.5,
    "duration_days": 3,
    "covid_risk": {
      "level": "HIGH",
      "percentage": 78.5
    },
    "urgent_care_needed": false,
    "recommendations": [...],
    "created_at": "2024-03-23T10:30:00"
  },
  {
    "id": 2,
    "symptoms": ["headache", "sore_throat"],
    "temperature": 98.6,
    "duration_days": 1,
    "covid_risk": {
      "level": "LOW",
      "percentage": 25.0
    },
    "urgent_care_needed": false,
    "recommendations": [...],
    "created_at": "2024-03-22T09:00:00"
  }
]
```

**Empty Response:**
```json
[]
```

---

### Get Alerts

Retrieve all active health alerts.

**Endpoint:** `GET /api/alerts`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "age": 35
    },
    "severity": "HIGH",
    "message": "HIGH RISK: John Doe shows high COVID-19 risk (78.5%)",
    "requires_action": true,
    "created_at": "2024-03-23T10:30:00"
  }
]
```

**Severity Levels:**
- `CRITICAL` - Urgent care needed
- `HIGH` - High COVID risk
- `MODERATE` - Moderate COVID risk

---

### Resolve Alert

Mark an alert as resolved.

**Endpoint:** `PUT /api/alerts/{alert_id}/resolve`

**URL Parameters:**
- `alert_id` (integer) - Alert ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Alert resolved"
}
```

---

### Get Statistics

Retrieve system statistics.

**Endpoint:** `GET /api/stats`

**Success Response (200):**
```json
{
  "total_users": 42,
  "total_assessments": 156,
  "active_alerts": 3,
  "high_risk_today": 2
}
```

---

## 🧪 Testing with cURL

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": 30,
    "gender": "male",
    "email": "test@example.com"
  }'
```

### Get User
```bash
curl http://localhost:5000/api/users/1
```

### Perform Assessment
```bash
curl -X POST http://localhost:5000/api/assess \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": 30,
    "gender": "male",
    "symptoms": ["fever", "dry_cough", "fatigue"],
    "temperature": 101.0,
    "duration_days": 2,
    "user_id": 1
  }'
```

### Get Symptom Categories
```bash
curl http://localhost:5000/api/symptoms/categories
```

### Get User Assessments
```bash
curl http://localhost:5000/api/assessments/user/1
```

### Get Alerts
```bash
curl http://localhost:5000/api/alerts
```

### Get Statistics
```bash
curl http://localhost:5000/api/stats
```

---

## 🔧 Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  email TEXT UNIQUE,
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assessments Table
```sql
CREATE TABLE assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  symptoms TEXT NOT NULL,
  temperature REAL,
  duration_days INTEGER,
  covid_risk_level TEXT,
  covid_risk_percentage REAL,
  urgent_care_needed BOOLEAN,
  recommendations TEXT,
  alert_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Alerts Table
```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  requires_action BOOLEAN,
  resolved BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

---

## 🔒 CORS Configuration

**Current:** Enabled for all origins (development)

```python
CORS(app)  # Allows all origins
```

**Production:** Restrict to specific domains
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"]
    }
})
```

---

## 🚀 Rate Limiting

**Current:** No rate limiting (development)

**Production:** Implement rate limiting
```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/assess')
@limiter.limit("10 per minute")
def assess():
    ...
```

---

## 📝 Best Practices

### Frontend Integration
```javascript
// React example
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Perform assessment
const performAssessment = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/assess`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Assessment failed:', error);
    throw error;
  }
};
```

### Error Handling
```javascript
try {
  const assessment = await performAssessment(data);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data.error);
  } else if (error.request) {
    // No response received
    console.error('No response from server');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

---

## 🔍 Monitoring

### View Logs
```bash
# Flask development server logs appear in terminal
python3 app.py
```

### Database Inspection
```bash
# Using sqlite3 CLI
sqlite3 backend/medbot.db

# View tables
.tables

# Query users
SELECT * FROM users;

# Query assessments
SELECT * FROM assessments ORDER BY created_at DESC LIMIT 10;
```

---

## 🎯 Future Enhancements

Planned API improvements:
- [ ] JWT authentication
- [ ] Role-based access control
- [ ] API versioning (/api/v1/, /api/v2/)
- [ ] Pagination for list endpoints
- [ ] WebSocket support for real-time updates
- [ ] File upload for medical documents
- [ ] Integration with third-party health APIs
- [ ] Webhook support for alerts
- [ ] GraphQL endpoint
- [ ] API documentation with Swagger/OpenAPI

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

**Need Help?** Check the main README or setup guide.

**Happy API Development! 🚀**
