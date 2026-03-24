"""
MedBot Backend API - Flask Application
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import json
import sys
import os

# Add shared module to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'shared'))
from symptom_analyzer import SymptomAnalyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize symptom analyzer
analyzer = SymptomAnalyzer()

# Database setup
DATABASE = 'medbot.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with required tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            email TEXT UNIQUE,
            medical_history TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Assessments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessments (
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
        )
    ''')
    
    # Health alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            severity TEXT NOT NULL,
            message TEXT NOT NULL,
            requires_action BOOLEAN,
            resolved BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# ============= API ROUTES =============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'MedBot API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    data = request.json
    
    # Validate required fields
    required = ['name', 'age', 'gender']
    if not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (name, age, gender, email, medical_history)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['age'],
            data['gender'],
            data.get('email'),
            json.dumps(data.get('medical_history', []))
        ))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'User created successfully'
        }), 201
        
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'name': user['name'],
        'age': user['age'],
        'gender': user['gender'],
        'email': user['email'],
        'medical_history': json.loads(user['medical_history'] or '[]'),
        'created_at': user['created_at']
    })

@app.route('/api/assess', methods=['POST'])
def assess_symptoms():
    """Perform symptom assessment"""
    data = request.json
    
    # Validate input
    required = ['name', 'age', 'gender', 'symptoms']
    if not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Prepare user data
        user_data = {
            'name': data['name'],
            'age': data['age'],
            'gender': data['gender'],
            'medical_history': data.get('medical_history', [])
        }
        
        # Perform analysis
        assessment = analyzer.analyze_symptoms(
            user_data=user_data,
            symptoms=data['symptoms'],
            duration_days=data.get('duration_days', 0),
            temperature=data.get('temperature', 0.0)
        )
        
        # Save to database if user_id provided
        if 'user_id' in data:
            conn = get_db()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO assessments (
                    user_id, symptoms, temperature, duration_days,
                    covid_risk_level, covid_risk_percentage, urgent_care_needed,
                    recommendations, alert_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['user_id'],
                json.dumps(data['symptoms']),
                data.get('temperature', 0.0),
                data.get('duration_days', 0),
                assessment['covid_risk']['level'],
                assessment['covid_risk']['percentage'],
                assessment['urgent_care_needed'],
                json.dumps(assessment['recommendations']),
                json.dumps(assessment['alert']) if assessment['alert'] else None
            ))
            
            assessment_id = cursor.lastrowid
            
            # Create alert if needed
            if assessment['alert']:
                cursor.execute('''
                    INSERT INTO alerts (user_id, severity, message, requires_action)
                    VALUES (?, ?, ?, ?)
                ''', (
                    data['user_id'],
                    assessment['alert']['severity'],
                    assessment['alert']['message'],
                    assessment['alert']['requires_action']
                ))
            
            conn.commit()
            conn.close()
            
            assessment['assessment_id'] = assessment_id
        
        return jsonify(assessment), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/symptoms/categories', methods=['GET'])
def get_symptom_categories():
    """Get categorized symptom list"""
    categories = analyzer.get_symptom_categories()
    
    # Format for display
    formatted = {}
    for category, symptoms in categories.items():
        formatted[category] = [
            {
                'key': symptom,
                'label': analyzer.format_symptom_name(symptom)
            }
            for symptom in symptoms
        ]
    
    return jsonify(formatted)

@app.route('/api/assessments/user/<int:user_id>', methods=['GET'])
def get_user_assessments(user_id):
    """Get all assessments for a user"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM assessments 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    
    assessments = cursor.fetchall()
    conn.close()
    
    results = []
    for assessment in assessments:
        results.append({
            'id': assessment['id'],
            'symptoms': json.loads(assessment['symptoms']),
            'temperature': assessment['temperature'],
            'duration_days': assessment['duration_days'],
            'covid_risk': {
                'level': assessment['covid_risk_level'],
                'percentage': assessment['covid_risk_percentage']
            },
            'urgent_care_needed': bool(assessment['urgent_care_needed']),
            'recommendations': json.loads(assessment['recommendations']),
            'created_at': assessment['created_at']
        })
    
    return jsonify(results)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all active alerts"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT a.*, u.name, u.age 
        FROM alerts a
        JOIN users u ON a.user_id = u.id
        WHERE a.resolved = 0
        ORDER BY a.created_at DESC
    ''')
    
    alerts = cursor.fetchall()
    conn.close()
    
    results = []
    for alert in alerts:
        results.append({
            'id': alert['id'],
            'user': {
                'id': alert['user_id'],
                'name': alert['name'],
                'age': alert['age']
            },
            'severity': alert['severity'],
            'message': alert['message'],
            'requires_action': bool(alert['requires_action']),
            'created_at': alert['created_at']
        })
    
    return jsonify(results)

@app.route('/api/alerts/<int:alert_id>/resolve', methods=['PUT'])
def resolve_alert(alert_id):
    """Mark an alert as resolved"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE alerts SET resolved = 1 WHERE id = ?', (alert_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Alert resolved'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get system statistics"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Total users
    cursor.execute('SELECT COUNT(*) as count FROM users')
    total_users = cursor.fetchone()['count']
    
    # Total assessments
    cursor.execute('SELECT COUNT(*) as count FROM assessments')
    total_assessments = cursor.fetchone()['count']
    
    # Active alerts
    cursor.execute('SELECT COUNT(*) as count FROM alerts WHERE resolved = 0')
    active_alerts = cursor.fetchone()['count']
    
    # High risk cases today
    cursor.execute('''
        SELECT COUNT(*) as count FROM assessments 
        WHERE covid_risk_level = 'HIGH' 
        AND DATE(created_at) = DATE('now')
    ''')
    high_risk_today = cursor.fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'total_users': total_users,
        'total_assessments': total_assessments,
        'active_alerts': active_alerts,
        'high_risk_today': high_risk_today
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🏥 MedBot API Server Starting...")
    print("📡 Server running on http://localhost:5000")
    print("📚 API Documentation:")
    print("  - GET  /api/health - Health check")
    print("  - POST /api/users - Create user")
    print("  - GET  /api/users/<id> - Get user")
    print("  - POST /api/assess - Assess symptoms")
    print("  - GET  /api/symptoms/categories - Get symptom categories")
    print("  - GET  /api/assessments/user/<id> - Get user assessments")
    print("  - GET  /api/alerts - Get active alerts")
    print("  - GET  /api/stats - Get statistics")
    
   if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
