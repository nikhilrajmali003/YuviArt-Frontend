import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  Loader,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

const ResponsiveSignup = ({ onClose, onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const apiResponse = await response.json();

      if (!response.ok || !apiResponse.success) {
        setError(apiResponse.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      const userData = {
        id: apiResponse.data.id,
        name: apiResponse.data.name,
        email: apiResponse.data.email,
        token: apiResponse.data.token,
      };

      if (apiResponse.data.token) {
        localStorage.setItem("yuviart_token", apiResponse.data.token);
      }

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess(userData);
        }
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);

      if (err.message.includes("fetch") || err.name === "TypeError") {
        setError("Cannot connect to server. Using demo mode...");
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          const userData = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
          };
          setTimeout(() => {
            if (onSignupSuccess) {
              onSignupSuccess(userData);
            }
          }, 2000);
        }, 1000);
      } else {
        setError("Signup failed. Please try again.");
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setLoading(true);

    try {
      window.location.href = `${API_BASE_URL.replace(
        "/api",
        ""
      )}/oauth2/authorization/google`;
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/80 via-gray-900/50 to-pink-900/80">
          <div className="absolute w-96 h-96 bg-purple-600/60 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
          <div
            className="absolute w-96 h-96 bg-pink-600/60 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute w-80 h-80 bg-blue-500/40 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="relative z-10 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-green-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-md w-full text-center shadow-2xl shadow-green-500/20 animate-fadeIn">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-scaleIn">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            Account Created!
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            Welcome to YuviArt community
          </p>
          <button
            onClick={() => {
              if (onSignupSuccess) {
                onSignupSuccess({
                  id: formData.id,
                  name: formData.name,
                  email: formData.email,
                });
              } else {
                window.location.href = "/";
              }
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 sm:py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-black flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/80 via-gray-900/50 to-pink-900/80">
        <div className="absolute w-96 h-96 bg-purple-600/60 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-pink-600/60 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-80 h-80 bg-blue-500/40 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute w-72 h-72 bg-purple-500/50 rounded-full blur-3xl top-1/4 right-1/4 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-72 h-72 bg-pink-500/50 rounded-full blur-3xl bottom-1/4 left-1/4 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <button
        onClick={handleBack}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group transform hover:scale-110 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="relative z-10 w-full max-w-md max-h-[95vh] overflow-y-auto animate-slideUp scrollbar-hide">
        <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C34.21 56 36 54.21 36 52C36 50.973 35.577 50.047 34.902 49.371C34.253 48.722 33.895 47.816 33.895 46.842C33.895 44.633 35.685 42.842 37.895 42.842H44C50.627 42.842 56 37.469 56 30.842C56 17.587 45.255 8 32 8Z"
                  fill="url(#paletteGradient)"
                  stroke="url(#paletteStroke)"
                  strokeWidth="2"
                />
                <circle cx="20" cy="24" r="4" fill="#E91E63" />
                <circle cx="32" cy="18" r="4" fill="#9C27B0" />
                <circle cx="44" cy="24" r="4" fill="#2196F3" />
                <circle cx="24" cy="36" r="4" fill="#4CAF50" />
                <circle cx="40" cy="32" r="4" fill="#FFC107" />
                <defs>
                  <linearGradient
                    id="paletteGradient"
                    x1="8"
                    y1="8"
                    x2="56"
                    y2="56"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9C27B0" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#E91E63" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient
                    id="paletteStroke"
                    x1="8"
                    y1="8"
                    x2="56"
                    y2="56"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9C27B0" />
                    <stop offset="1" stopColor="#E91E63" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-left">
                <h1 className="flex items-center text-2xl sm:text-3xl font-bold">
                  <span className="text-purple-800">YuviArt</span>
                </h1>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Create Account
            </h2>
            <p className="text-xs text-gray-400">
              Join our artistic community today
            </p>
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            {error && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2 animate-shake">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2.5 sm:space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      focusedField === "name"
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      focusedField === "email"
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Phone Number{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <Phone
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      focusedField === "phone"
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      focusedField === "password"
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CheckCircle
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      focusedField === "confirmPassword"
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="
    w-full
    bg-blue-600
    hover:bg-blue-700
    text-white
    py-3
    rounded-xl
    font-bold
    transition-all
    duration-300
    disabled:opacity-50
    disabled:cursor-not-allowed
    flex
    items-center
    justify-center
    gap-1
    mt-3
    shadow-lg
    hover:shadow-blue-600/40
    transform
    hover:scale-[1.02]
    active:scale-[0.98]
    text-sm
  "
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-semibold">
                Continue with Google
              </span>
            </button>

            <p className="text-xs text-gray-500 text-center mt-2.5 leading-relaxed">
              By signing up, you agree to our{" "}
              <button className="text-purple-400 hover:text-purple-300 transition-colors underline-offset-2 hover:underline">
                Terms
              </button>
              {" & "}
              <button className="text-purple-400 hover:text-purple-300 transition-colors underline-offset-2 hover:underline">
                Privacy Policy
              </button>
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <p className="text-xs text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={
                    onSwitchToLogin || (() => (window.location.href = "/login"))
                  }
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors underline-offset-2 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveSignup;
