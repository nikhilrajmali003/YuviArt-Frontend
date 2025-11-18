import React, { useState, useEffect } from "react";
import { Star, Loader, CheckCircle, AlertCircle, Send, X, MessageSquare } from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";
const USE_MOCK_DATA = true; // ✅ Always keep mock data for fallback testing

// Mock testimonials (these always remain visible)
const mockTestimonials = [
  { id: 1, name: "Priya Sharma", text: "Absolutely stunning artwork! Exceeded expectations.", rating: 5, approved: true },
  { id: 2, name: "Rahul Verma", text: "Professional service and incredible attention to detail.", rating: 5, approved: true },
  { id: 3, name: "Anita Desai", text: "The custom piece brought tears to my eyes. Highly recommend!", rating: 5, approved: true },
  { id: 4, name: "Nikhil Raj Mali", text: "Absolute Mind Blowing", rating: 5, approved: true }
];

// ============ TESTIMONIAL FORM COMPONENT ============
const TestimonialForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", rating: 5, text: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email";

    if (!form.text.trim()) newErrors.text = "Testimonial is required";
    else if (form.text.trim().length < 10) newErrors.text = "Testimonial must be at least 10 characters";
    else if (form.text.trim().length > 500) newErrors.text = "Testimonial must be less than 500 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleRatingClick = (rating) => setForm({ ...form, rating });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors before submitting" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    if (USE_MOCK_DATA) {
      // ✅ Simulate backend submission for testing
      setTimeout(() => {
        setLoading(false);
        setMessage({
          type: "success",
          text: "✨ Thank you! Your testimonial has been submitted for review.",
        });
        setForm({ name: "", email: "", rating: 5, text: "" });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 3000);
      }, 1500);
      return;
    }

    // ✅ Real backend request
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✨ Thank you! Your testimonial has been submitted for review.",
        });
        setForm({ name: "", email: "", rating: 5, text: "" });
        setErrors({});
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({
          type: "error",
          text: errorData.message || "❌ Failed to submit. Please try again.",
        });
      }
    } catch (error) {
      console.error("Testimonial submission error:", error);
      setMessage({
        type: "error",
        text: "⚠️ Server not reachable. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const characterCount = form.text.length;
  const maxCharacters = 500;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-700 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Share Your Experience
        </h2>
        <p className="text-gray-400 text-sm">Your feedback helps us grow and inspires future clients</p>
      </div>

      <div className="space-y-5">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-300">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition ${
              errors.name ? "border-red-500" : "border-gray-700"
            }`}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-300">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-700"
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">Your email will not be publicly displayed</p>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">Your Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    star <= (hoveredRating || form.rating)
                      ? "fill-yellow-400 text-yellow-400 scale-110"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-gray-400 self-center">
              ({form.rating} star{form.rating !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Testimonial Textarea */}
        <div>
          <label htmlFor="text" className="block text-sm font-semibold mb-2 text-gray-300">
            Your Testimonial *
          </label>
          <textarea
            id="text"
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Share your experience with YuviArt..."
            rows="5"
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none transition ${
              errors.text ? "border-red-500" : "border-gray-700"
            }`}
            maxLength={maxCharacters}
          />
          <div className="flex justify-between items-start mt-1">
            <div className="flex-1">
              {errors.text && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.text}
                </p>
              )}
            </div>
            <p className={`text-xs ${characterCount > maxCharacters * 0.9 ? "text-yellow-400" : "text-gray-500"}`}>
              {characterCount}/{maxCharacters}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Testimonial
            </>
          )}
        </button>
      </div>

      {/* Status Message */}
      {message.text && (
        <div
          className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-900/30 border-green-500/50 text-green-300"
              : "bg-red-900/30 border-red-500/50 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
        🔒 Your testimonial will be reviewed before being published.
      </div>
    </div>
  );
};

// ✅ EXPORT
const ClientTestimonialForm = ({ onClose, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="text-center mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 inline-flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Share Your Feedback
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-2xl">
            <TestimonialForm
              onClose={() => {
                setShowModal(false);
                if (onClose) onClose();
              }}
              onSuccess={() => {
                if (onSuccess) onSuccess();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ClientTestimonialForm;
