import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import EnhancedAdminPanel from './AdminPanel.jsx'
import AdminLogin from './AdminLogin.jsx'
import Signup from './pages/Signup.jsx'
import './index.css'

// Admin Router Component
const AdminRouter = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const admin = localStorage.getItem('admin_user');
    
    if (token && admin) {
      setIsAuthenticated(true);
      setAdminData(JSON.parse(admin));
      setCurrentView('admin');
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (admin) => {
    setIsAuthenticated(true);
    setAdminData(admin);
    setCurrentView('admin');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminData(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setCurrentView('login');
  };

  // Handle navigation to signup
  const handleNavigateToSignup = () => {
    setCurrentView('signup');
  };

  // Handle navigation to login
  const handleNavigateToLogin = () => {
    setCurrentView('login');
  };

  // Render current view
  if (currentView === 'signup') {
    return (
      <Signup 
        onSignupSuccess={handleNavigateToLogin}
        onNavigateToLogin={handleNavigateToLogin}
        setCurrentPage={setCurrentView}
      />
    );
  }

  if (currentView === 'admin' && isAuthenticated) {
    return (
      <EnhancedAdminPanel 
        onLogout={handleLogout}
        onNavigateToSignup={handleNavigateToSignup}
        adminData={adminData}
      />
    );
  }

  // Default to login
  return (
    <AdminLogin 
      onLoginSuccess={handleLoginSuccess}
      onNavigateToSignup={handleNavigateToSignup}
    />
  );
};

// Main App Router
const AppRouter = () => {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminRouter />;
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)