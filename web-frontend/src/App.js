import React, { useState } from 'react';
import './styles/App.css';
import SymptomChecker from './pages/SymptomChecker';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';

function App() {
  const [currentPage, setCurrentPage] = useState('checker');
  const [userId, setUserId] = useState(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'checker':
        return <SymptomChecker userId={userId} setUserId={setUserId} />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <UserProfile userId={userId} setUserId={setUserId} />;
      default:
        return <SymptomChecker userId={userId} setUserId={setUserId} />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🏥</div>
            <div className="logo-text">
              <h1>MedBot</h1>
              <p>Health Assistant</p>
            </div>
          </div>
          
          <nav className="nav-menu">
            <button 
              className={currentPage === 'checker' ? 'active' : ''}
              onClick={() => setCurrentPage('checker')}
            >
              🩺 Symptom Checker
            </button>
            <button 
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={currentPage === 'profile' ? 'active' : ''}
              onClick={() => setCurrentPage('profile')}
            >
              👤 Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>⚠️ Disclaimer: This is a preliminary health assessment tool. Always consult with a healthcare professional for accurate diagnosis.</p>
          <p className="copyright">© 2024 MedBot Health Assistant | Built with ❤️ for better health</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
