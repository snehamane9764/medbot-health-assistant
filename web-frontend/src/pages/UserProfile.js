import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserProfile.css';

const API_URL = 'http://localhost:5000/api';

function UserProfile({ userId, setUserId }) {
  const [isCreating, setIsCreating] = useState(!userId);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: 'male',
    email: ''
  });
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchAssessments();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`${API_URL}/assessments/user/${userId}`);
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      setUserId(response.data.user_id);
      setIsCreating(false);
      alert('Profile created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isCreating) {
    return (
      <div className="user-profile">
        <h1>👤 Create Your Profile</h1>
        <p className="profile-description">Create a profile to track your health assessments</p>

        <form onSubmit={handleCreateUser} className="profile-form">
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

          <div className="form-group">
            <label>Email (Optional)</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              placeholder="your.email@example.com"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Profile'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h1>👤 Your Profile</h1>

      {/* User Info Card */}
      <div className="profile-card">
        <h2>Personal Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Name:</span>
            <span className="value">{userData.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Age:</span>
            <span className="value">{userData.age} years</span>
          </div>
          <div className="info-item">
            <span className="label">Gender:</span>
            <span className="value">{userData.gender}</span>
          </div>
          {userData.email && (
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{userData.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Assessment History */}
      <div className="assessment-history">
        <h2>📋 Assessment History</h2>
        {assessments.length === 0 ? (
          <div className="no-assessments">
            <p>No assessments yet. Take your first symptom check!</p>
          </div>
        ) : (
          <div className="assessments-list">
            {assessments.map((assessment, index) => (
              <div key={index} className="assessment-item">
                <div className="assessment-header">
                  <span className="assessment-date">
                    {new Date(assessment.created_at).toLocaleString()}
                  </span>
                  <span className={`risk-badge risk-${assessment.covid_risk.level.toLowerCase()}`}>
                    {assessment.covid_risk.level} RISK
                  </span>
                </div>
                <div className="assessment-body">
                  <p className="risk-score">
                    COVID-19 Risk: {assessment.covid_risk.percentage}%
                  </p>
                  <div className="symptoms-list">
                    <strong>Symptoms:</strong>
                    <span> {assessment.symptoms.map(s => s.replace('_', ' ')).join(', ')}</span>
                  </div>
                  {assessment.urgent_care_needed && (
                    <div className="urgent-badge">
                      🚨 Urgent Care Recommended
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
