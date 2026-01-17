import React, { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Palette,
  Loader,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

import { API_BASE_URL } from "../services/api"; // Adjust path as needed

const sanitizeInput = (input) =>
  input?.toString().trim().replace(/[<>]/g, "") || "";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "from-green-600 to-emerald-600",
    error: "from-red-600 to-rose-600",
    info: "from-blue-600 to-cyan-600",
  };

  const Icon = type === "success" ? Check : type === "error" ? X : AlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-gradient-to-r ${colors[type]} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3`}
    >
      <Icon className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setFieldErrors({ ...fieldErrors, [field]: error });
  };

  const handleChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData({ ...formData, [field]: sanitizedValue });

    if (touched[field]) {
      const error = validateField(field, sanitizedValue);
      setFieldErrors({ ...fieldErrors, [field]: error });
    }

    if (error) setError("");
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        const token = data.token || "demo-token";
        const adminUser = data.admin || { email: formData.email };

        localStorage.setItem("adminToken", token);
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminUser", JSON.stringify(adminUser));

        showToast("✅ Login successful! Redirecting...", "success");

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(adminUser);
          } else {
            window.location.href = "/admin/dashboard";
          }
        }, 1500);
      } else {
        let errorMessage = "Login failed. Please try again.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error("Could not parse error response");
        }

        if (response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (response.status === 404) {
          errorMessage = "Account not found. Please sign up first.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    } catch (err) {
      const errorMessage =
        "Cannot connect to server. Is backend running on port 8080?";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      !fieldErrors.email &&
      !fieldErrors.password
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#1e3a8a_0%,_#020617_70%)] flex items-center justify-center p-4 relative overflow-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/4 left-1/4 animate-ping"></div>
        <div className="absolute w-2 h-2 bg-blue-400 rounded-full top-3/4 right-1/4 animate-ping"></div>
        <div className="absolute w-2 h-2 bg-teal-400 rounded-full bottom-1/4 left-3/4 animate-ping"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 via-blue-600/50 to-teal-600/50 blur-3xl -z-10 animate-pulse"></div>

        <div className="bg-slate-950/98 backdrop-blur-2xl border-2 border-cyan-400/60 rounded-3xl p-10 shadow-2xl shadow-cyan-500/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl"></div>

          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-600 mb-4 shadow-2xl shadow-cyan-500/50 animate-pulse">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
              Admin Portal
            </h1>
            <p className="text-cyan-200 flex items-center justify-center gap-2 text-sm">
              <Palette className="w-4 h-4 text-blue-400" />
              YuviArt Management System
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl flex items-start gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200 text-sm font-semibold mb-1">
                  Login Error
                </p>
                <p className="text-red-100 text-xs">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-5 relative">
            <div>
              <label className="block text-sm font-semibold mb-2 text-cyan-200">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-blue-400 transition" />
                <input
                  type="email"
                  placeholder="admin@yuviart.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-950/90 backdrop-blur-sm border-2 rounded-xl text-white placeholder-cyan-500/60 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email && touched.email
                      ? "border-red-400/50 focus:border-red-400 focus:ring-red-500/30"
                      : "border-cyan-500/40 focus:border-blue-400 focus:ring-blue-400/30 hover:border-cyan-400/60"
                  }`}
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-teal-500/0 group-focus-within:from-cyan-500/10 group-focus-within:via-blue-500/10 group-focus-within:to-teal-500/10 pointer-events-none transition-all"></div>
              </div>
              {fieldErrors.email && touched.email && (
                <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-cyan-200">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-blue-400 transition" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isFormValid()) {
                      handleSubmit(e);
                    }
                  }}
                  className={`w-full pl-12 pr-12 py-4 bg-slate-950/90 backdrop-blur-sm border-2 rounded-xl text-white placeholder-cyan-500/60 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password && touched.password
                      ? "border-red-400/50 focus:border-red-400 focus:ring-red-500/30"
                      : "border-cyan-500/40 focus:border-blue-400 focus:ring-blue-400/30 hover:border-cyan-400/60"
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-blue-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-teal-500/0 group-focus-within:from-cyan-500/10 group-focus-within:via-blue-500/10 group-focus-within:to-teal-500/10 pointer-events-none transition-all"></div>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-cyan-500/50 bg-slate-950/90 text-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
                <span className="text-sm text-cyan-300 group-hover:text-cyan-200 transition">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              className="relative w-full group mt-6"
            >
              <div className="absolute -inset-0.5 rounded-xl blur bg-blue-600 opacity-20 group-hover:opacity-45 transition-opacity duration-300"></div>
              <div
                className={`relative flex items-center justify-center bg-[#020617] border border-blue-500/50 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-out ${
                  loading || !isFormValid()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In to Dashboard
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="mt-8 p-4 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl">
            <p className="text-xs text-cyan-200 text-center flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              🔒 Secure encrypted connection • Your data is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
