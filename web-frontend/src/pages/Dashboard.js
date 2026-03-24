import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/alerts`)
      ]);
      
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await axios.put(`${API_URL}/alerts/${alertId}/resolve`);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 System Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.total_users || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats?.total_assessments || 0}</h3>
            <p>Assessments</p>
          </div>
        </div>

        <div className="stat-card alert-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <h3>{stats?.active_alerts || 0}</h3>
            <p>Active Alerts</p>
          </div>
        </div>

        <div className="stat-card risk-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats?.high_risk_today || 0}</h3>
            <p>High Risk Today</p>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="alerts-section">
        <h2>🔔 Active Health Alerts</h2>
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <p>✅ No active alerts</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-item severity-${alert.severity.toLowerCase()}`}>
                <div className="alert-header">
                  <span className="severity-badge">{alert.severity}</span>
                  <span className="alert-time">{new Date(alert.created_at).toLocaleString()}</span>
                </div>
                <div className="alert-body">
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-user">
                    Patient: {alert.user.name} (Age: {alert.user.age})
                  </p>
                </div>
                <div className="alert-actions">
                  {alert.requires_action && (
                    <span className="action-required">⚠️ Action Required</span>
                  )}
                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    className="btn-resolve"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
