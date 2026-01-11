import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Admin Components
import EnhancedAdminPanel from "./AdminPanel.jsx";
import AdminLogin from "./AdminLogin.jsx";

// Client Components
import Signup from "./pages/Signup.jsx";

import "./index.css";

// --------------------------
// ADMIN ROUTER
// --------------------------
const AdminRouter = () => {
  const [currentView, setCurrentView] = useState("login"); // login | signup | admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const admin = localStorage.getItem("admin_user");

    if (token && admin) {
      setIsAuthenticated(true);
      setAdminData(JSON.parse(admin));
      setCurrentView("admin");
    }
  }, []);

  // On successful login
  const handleLoginSuccess = (admin) => {
    setIsAuthenticated(true);
    setAdminData(admin);
    setCurrentView("admin");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setIsAuthenticated(false);
    setAdminData(null);
    setCurrentView("login");
  };

  // Navigation
  const handleNavigateToSignup = () => setCurrentView("signup");
  const handleNavigateToLogin = () => setCurrentView("login");

  // --------------------------
  // VIEW RENDERING
  // --------------------------

  // Admin Signup Page
  if (currentView === "signup") {
    return (
      <AdminSignup
        onSignupSuccess={handleNavigateToLogin}
        onNavigateToLogin={handleNavigateToLogin}
        setCurrentPage={setCurrentView}
      />
    );
  }

  // Admin Panel (after login)
  if (currentView === "admin" && isAuthenticated) {
    return <EnhancedAdminPanel onLogout={handleLogout} adminData={adminData} />;
  }

  // Admin Login Page (default)
  return (
    <AdminLogin
      onLoginSuccess={handleLoginSuccess}
      onNavigateToSignup={handleNavigateToSignup}
    />
  );
};

// --------------------------
// MAIN APP ROUTER
// --------------------------
const AppRouter = () => {
  const path = window.location.pathname;

  // /admin → admin router
  if (path === "/admin") {
    return <AdminRouter />;
  }

  // Default → client app
  return <App />;
};

// --------------------------
// RENDER APP
// --------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
