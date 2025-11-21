import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  Palette,
  Loader,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const Signup = ({ onSignupSuccess, onNavigateToLogin, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        alert(
          "✅ Account created successfully! Please login with your credentials."
        );
        handleNavigateToLogin();
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Signup failed. Email may already be registered."
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else if (setCurrentPage) {
      setCurrentPage("login");
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-600/30 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      {/* Back Button - Top Left - FIXED */}
      <button
        onClick={handleNavigateToLogin}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Back to Login</span>
      </button>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-4 shadow-xl shadow-purple-500/50">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                YuviArt
              </span>
            </h1>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-400">Join our artistic community today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                At least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Palette className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Terms & Sign In Section */}
          <div className="mt-6 space-y-4">
            {/* Terms */}
            <div className="text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <span className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </span>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/80 text-gray-400">or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={handleNavigateToLogin}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
