import React, { useState } from "react";
import { Shield, Mail, Lock, User, Loader, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "./services/api.js";

const AdminSignup = ({ onSignupSuccess, onNavigateToLogin, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "", // Simple security measure
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSignupSuccess();
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
        <button 
          onClick={onNavigateToLogin}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/40">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Registration</h2>
          <p className="text-cyan-400/60 mt-2">Create a new administrative account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Register Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
