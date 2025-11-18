import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, Palette, Loader, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Signup = ({ onSignupSuccess, onNavigateToLogin, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Show success message
        alert('✅ Account created successfully! Redirecting to login...');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login page
        if (onSignupSuccess) {
          onSignupSuccess();
        } else if (onNavigateToLogin) {
          onNavigateToLogin();
        } else if (setCurrentPage) {
          setCurrentPage('login');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed. Email may already be registered.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please check if the backend server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else if (setCurrentPage) {
      setCurrentPage('login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-600/30 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700"></div>
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000"></div>
      </div>

      {/* Back Button - Top Left */}
      <button
        onClick={handleNavigateToLogin}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 group cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105"
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
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join our artistic community today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition cursor-text"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition cursor-text"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Password (min 6 characters)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition cursor-text"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Confirm Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition cursor-text"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
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
              By signing up, you agree to our{' '}
              <button className="text-purple-400 hover:text-purple-300 underline cursor-pointer">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-purple-400 hover:text-purple-300 underline cursor-pointer">
                Privacy Policy
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={handleNavigateToLogin}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer transition-colors duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Demo Mode Helper */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => {
                setFormData({
                  name: 'Demo Admin',
                  email: 'demo@yuviart.com',
                  password: 'demo123',
                  confirmPassword: 'demo123'
                });
              }}
              className="text-xs text-gray-500 hover:text-gray-400 transition cursor-pointer"
            >
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-500/30">
                Demo Mode: Fill all fields to create account
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
        
        /* Ensure all interactive elements have pointer cursor */
        button, input[type="submit"], a {
          cursor: pointer !important;
        }
        
        input {
          cursor: text !important;
        }
        
        button:disabled {
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
};

export default Signup;