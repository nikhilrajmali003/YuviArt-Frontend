import React, { useState } from 'react';
import { Palette, Mail, Lock, User, Loader, X, ArrowLeft, CheckCircle } from 'lucide-react';

const Signup = ({ onSignupSuccess, onSwitchToLogin, onClose, selectedArtwork }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Validate all fields
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Name validation
      if (formData.name.length < 2) {
        setError('Name must be at least 2 characters long');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Password validation
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Password match validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Simulate API call - Replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email
      };

      // Call success handler
      onSignupSuccess(userData);
    } catch (err) {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-rose-900/20" />
        <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl top-0 right-0 animate-pulse" />
        <div className="absolute w-96 h-96 bg-pink-600/30 rounded-full blur-3xl bottom-0 left-0 animate-pulse" />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center transition group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Palette className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                YuviArt
              </h1>
            </div>
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-400">Join our artistic community today</p>
          </div>

          {/* Selected Artwork Preview */}
          {selectedArtwork && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl animate-fadeIn">
              <p className="text-sm text-purple-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                Complete signup to add:
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  className="w-20 h-20 rounded-lg object-cover border border-white/10"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{selectedArtwork.title}</p>
                  <p className="text-purple-400 font-bold text-xl">₹{selectedArtwork.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-start gap-2 animate-shake">
              <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Signup Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Submit Button */}
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
                'Create Account'
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our{' '}
            <button className="text-purple-400 hover:text-purple-300 transition">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-purple-400 hover:text-purple-300 transition">
              Privacy Policy
            </button>
          </p>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-400 font-semibold hover:text-purple-300 transition"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Demo Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-300 text-sm text-center">
              <strong>Demo Mode:</strong> Fill all fields to create account
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signup;