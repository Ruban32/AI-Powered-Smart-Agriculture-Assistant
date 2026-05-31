import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CropSelectionPage from './pages/CropSelectionPage';
import SoilDetailsPage from './pages/SoilDetailsPage';
import DiseaseAnalysisPage from './pages/DiseaseAnalysisPage';
import RecommendationsPage from './pages/RecommendationsPage';
import AdminPanel from './pages/AdminPanel';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('userData');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(savedUser));
      setUserRole(savedRole || 'user');
    }
  }, []);

  const handleLogin = (user, role = 'user') => {
    setIsAuthenticated(true);
    setUserData(user);
    setUserRole(role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setUserRole('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated ? (
          <>
            <Navbar 
              user={userData} 
              onLogout={handleLogout}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="main-content">
              {userRole !== 'admin' && (
                <Sidebar isOpen={sidebarOpen} userRole={userRole} />
              )}
              <div className={`content-wrapper ${userRole === 'admin' ? 'admin-full' : ''}`}>
                <Routes>
                  <Route path="/" element={<DashboardPage userData={userData} />} />
                  <Route path="/crop-selection" element={<CropSelectionPage userData={userData} />} />
                  <Route path="/soil-details" element={<SoilDetailsPage userData={userData} />} />
                  <Route path="/disease-analysis" element={<DiseaseAnalysisPage userData={userData} />} />
                  <Route path="/recommendations" element={<RecommendationsPage userData={userData} />} />
                  {userRole === 'admin' && (
                    <Route path="/admin" element={<AdminPanel userData={userData} />} />
                  )}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
