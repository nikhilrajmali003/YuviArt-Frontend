import React, { useState } from "react";
import { Mail, Lock, Loader, X, ArrowLeft, Eye, EyeOff } from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

const Login = ({
  onLoginSuccess,
  onSwitchToSignup,
  onClose,
  selectedArtwork,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
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

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const apiResponse = await response.json();

      if (!response.ok || !apiResponse.success) {
        setError(apiResponse.message || "Login failed. Please try again.");
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

      onLoginSuccess(userData);
    } catch (err) {
      console.error("Login error:", err);

      if (err.message.includes("fetch") || err.name === "TypeError") {
        setError("Cannot connect to server. Using demo mode...");
        setTimeout(() => {
          const userData = {
            id: Date.now(),
            name: formData.email.split("@")[0],
            email: formData.email,
          };
          onLoginSuccess(userData);
        }, 1000);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
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

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen h-screen bg-black flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background */}
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

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group transform hover:scale-110 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md max-h-[95vh] overflow-y-auto animate-slideUp scrollbar-hide">
        <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-none">
                  <span className="text-purple-800">YuviArt</span>
                </h1>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-400">
              Sign in to continue your art journey
            </p>
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            {/* Selected Artwork Preview */}
            {selectedArtwork && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl animate-fadeIn">
                <p className="text-xs text-purple-300 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  You're about to add:
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    className="w-16 h-16 rounded-lg object-cover border border-white/10"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {selectedArtwork.title}
                    </p>
                    <p className="text-purple-400 font-bold text-lg">
                      ₹{selectedArtwork.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2 animate-shake">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2.5 sm:space-y-3">
              {/* Email Field */}
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

              {/* Password Field */}
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
                    placeholder="Enter your password"
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

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                c
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Login Button */}
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

            {/* Sign Up Link */}
            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <p className="text-xs text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors underline-offset-2 hover:underline"
                >
                  Sign Up
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
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
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

export default Login;
