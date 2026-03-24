import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SymptomChecker.css';

const API_URL = 'http://localhost:5000/api';

function SymptomChecker({ userId, setUserId }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: 'male'
  });
  const [symptomCategories, setSymptomCategories] = useState({});
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [duration, setDuration] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch symptom categories
    axios.get(`${API_URL}/symptoms/categories`)
      .then(response => setSymptomCategories(response.data))
      .catch(error => console.error('Error fetching symptoms:', error));
  }, []);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (userData.name && userData.age) {
      setStep(2);
    }
  };

  const toggleSymptom = (symptomKey) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomKey)
        ? prev.filter(s => s !== symptomKey)
        : [...prev, symptomKey]
    );
  };

  const handleAssessment = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/assess`, {
        name: userData.name,
        age: parseInt(userData.age),
        gender: userData.gender,
        symptoms: selectedSymptoms,
        temperature: parseFloat(temperature) || 0,
        duration_days: parseInt(duration) || 0,
        user_id: userId
      });

      setAssessment(response.data);
      setStep(3);
    } catch (error) {
      console.error('Error performing assessment:', error);
      alert('Error performing assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setTemperature('');
    setDuration('');
    setAssessment(null);
  };

  const getRiskColor = (level) => {
    const colors = {
      'HIGH': '#e74c3c',
      'MODERATE': '#f39c12',
      'LOW': '#f1c40f',
      'MINIMAL': '#27ae60'
    };
    return colors[level] || '#95a5a6';
  };

  return (
    <div className="symptom-checker">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">User Info</div>
        </div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Symptoms</div>
        </div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Results</div>
        </div>
      </div>

      {/* Step 1: User Information */}
      {step === 1 && (
        <div className="step-container fade-in">
          <h2>👤 Your Information</h2>
          <p className="step-description">Let's start with some basic information</p>
          
          <form onSubmit={handleUserSubmit} className="user-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                value={userData.age}
                onChange={(e) => setUserData({...userData, age: e.target.value})}
                placeholder="Enter your age"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                value={userData.gender}
                onChange={(e) => setUserData({...userData, gender: e.target.value})}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Continue to Symptoms →
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Symptom Selection */}
      {step === 2 && (
        <div className="step-container fade-in">
          <h2>🩺 Select Your Symptoms</h2>
          <p className="step-description">Choose all symptoms you're experiencing</p>

          <div className="symptoms-grid">
            {Object.entries(symptomCategories).map(([category, symptoms]) => (
              <div key={category} className="symptom-category">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="symptom-list">
                  {symptoms.map(symptom => (
                    <button
                      key={symptom.key}
                      className={`symptom-btn ${selectedSymptoms.includes(symptom.key) ? 'selected' : ''}`}
                      onClick={() => toggleSymptom(symptom.key)}
                    >
                      {selectedSymptoms.includes(symptom.key) ? '✓ ' : ''}
                      {symptom.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="additional-info">
            <h3>📊 Additional Information</h3>
            <div className="info-grid">
              <div className="form-group">
                <label>Body Temperature (°F)</label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="e.g., 98.6"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Symptom Duration (days)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 3"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={() => setStep(1)} className="btn-secondary">
              ← Back
            </button>
            <button 
              onClick={handleAssessment} 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Get Assessment →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Assessment Results */}
      {step === 3 && assessment && (
        <div className="step-container fade-in">
          <h2>📋 Your Health Assessment</h2>
          
          {/* COVID Risk Card */}
          <div className="risk-card" style={{ borderColor: getRiskColor(assessment.covid_risk.level) }}>
            <div className="risk-header" style={{ backgroundColor: getRiskColor(assessment.covid_risk.level) }}>
              <h3>🦠 COVID-19 Risk Assessment</h3>
            </div>
            <div className="risk-body">
              <div className="risk-level">
                <span className="label">Risk Level:</span>
                <span className="value" style={{ color: getRiskColor(assessment.covid_risk.level) }}>
                  {assessment.covid_risk.level}
                </span>
              </div>
              <div className="risk-score">
                <span className="label">Risk Score:</span>
                <span className="value">{assessment.covid_risk.percentage}%</span>
              </div>
              {assessment.covid_risk.critical_symptoms.length > 0 && (
                <div className="critical-symptoms">
                  <strong>Critical Symptoms Detected:</strong>
                  <ul>
                    {assessment.covid_risk.critical_symptoms.map((symptom, idx) => (
                      <li key={idx}>⚠️ {symptom.replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Urgent Care Warning */}
          {assessment.urgent_care_needed && (
            <div className="urgent-warning">
              <h3>🚨 URGENT MEDICAL ATTENTION REQUIRED</h3>
              <p>Based on your symptoms, you should seek immediate medical care.</p>
            </div>
          )}

          {/* Recommendations */}
          <div className="recommendations-card">
            <h3>💡 Recommendations</h3>
            <ul className="recommendations-list">
              {assessment.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Alert Info */}
          {assessment.alert && (
            <div className="alert-card">
              <h3>🔔 Health Alert Generated</h3>
              <p><strong>Severity:</strong> {assessment.alert.severity}</p>
              <p>{assessment.alert.message}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="disclaimer-card">
            <p>⚠️ {assessment.disclaimer}</p>
          </div>

          <button onClick={resetAssessment} className="btn-primary">
            Start New Assessment
          </button>
        </div>
      )}
    </div>
  );
}

export default SymptomChecker;
