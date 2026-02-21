import React, { useState, useEffect, lazy, Suspense } from "react";
import { Loader } from "lucide-react";

// Lazy Load Components
const App = lazy(() => import("./App.jsx"));
const EnhancedAdminPanel = lazy(() => import("./AdminPanel.jsx"));
const AdminLogin = lazy(() => import("./AdminLogin.jsx"));
const AdminSignup = lazy(() => import("./AdminSignup.jsx"));

// --------------------------
// LOADING FALLBACK
// --------------------------
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
      <p className="text-white text-xl">Loading...</p>
    </div>
  </div>
);

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

  // View Rendering
  return (
    <Suspense fallback={<PageLoader />}>
      {currentView === "signup" && (
        <AdminSignup
          onSignupSuccess={handleNavigateToLogin}
          onNavigateToLogin={handleNavigateToLogin}
          setCurrentPage={setCurrentView}
        />
      )}
      {currentView === "admin" && isAuthenticated && (
        <EnhancedAdminPanel onLogout={handleLogout} adminData={adminData} />
      )}
      {currentView === "login" && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={handleNavigateToSignup}
        />
      )}
    </Suspense>
  );
};

// --------------------------
// MAIN APP ROUTER
// --------------------------
const AppRouter = () => {
  const path = window.location.pathname;

  return (
    <Suspense fallback={<PageLoader />}>
      {path === "/admin" ? <AdminRouter /> : <App />}
    </Suspense>
  );
};

export default AppRouter;
