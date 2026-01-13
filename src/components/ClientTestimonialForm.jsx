import React, { useState } from "react";
import {
  Star,
  Loader,
  CheckCircle,
  AlertCircle,
  Send,
  X,
  MessageSquare,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";
const USE_MOCK_DATA = true; // ✅ Always keep mock data for fallback testing

// ============ TESTIMONIAL FORM COMPONENT ============
const TestimonialForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Please enter a valid email";

    if (!form.text.trim()) newErrors.text = "Testimonial is required";
    else if (form.text.trim().length < 10)
      newErrors.text = "Testimonial must be at least 10 characters";
    else if (form.text.trim().length > 500)
      newErrors.text = "Testimonial must be less than 500 characters";

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
      setMessage({
        type: "error",
        text: "Please fix the errors before submitting",
      });
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
    <div className="bg-white/5 backdrop-blur-xl text-white p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl w-full mx-auto border border-white/10 relative max-w-[95vw] sm:max-w-xl md:max-w-2xl">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-10"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </button>
      )}

      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 shadow-lg shadow-purple-500/50 animate-pulse">
          <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Share Your Experience
          </span>
        </h2>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm px-2 sm:px-4">
          Your feedback helps us grow and inspires future clients
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] sm:text-xs md:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300"
          >
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base bg-white/5 backdrop-blur-sm border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-300 placeholder:text-gray-500 ${
              errors.name
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-purple-500/50 hover:border-white/20"
            }`}
          />
          {errors.name && (
            <p className="text-red-400 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] sm:text-xs md:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300"
          >
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base bg-white/5 backdrop-blur-sm border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-300 placeholder:text-gray-500 ${
              errors.email
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-purple-500/50 hover:border-white/20"
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {errors.email}
            </p>
          )}
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2">
            🔒 Your email will not be publicly displayed
          </p>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-[11px] sm:text-xs md:text-sm font-semibold mb-1.5 sm:mb-2 md:mb-3 text-gray-300">
            Your Rating *
          </label>
          <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-all duration-200 ${
                    star <= (hoveredRating || form.rating)
                      ? "fill-yellow-400 text-yellow-400 scale-110 drop-shadow-lg"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                />
              </button>
            ))}
            <span className="ml-1 sm:ml-2 text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium">
              {form.rating} / 5
            </span>
          </div>
        </div>

        {/* Testimonial Textarea */}
        <div>
          <label
            htmlFor="text"
            className="block text-[11px] sm:text-xs md:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300"
          >
            Your Testimonial *
          </label>
          <textarea
            id="text"
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Share your experience with YuviArt..."
            rows="3"
            className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base bg-white/5 backdrop-blur-sm border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all duration-300 placeholder:text-gray-500 ${
              errors.text
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-purple-500/50 hover:border-white/20"
            }`}
            maxLength={maxCharacters}
          />
          <div className="flex justify-between items-start mt-1 sm:mt-2">
            <div className="flex-1">
              {errors.text && (
                <p className="text-red-400 text-[10px] sm:text-xs flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {errors.text}
                </p>
              )}
            </div>
            <p
              className={`text-[10px] sm:text-xs font-medium ${
                characterCount > maxCharacters * 0.9
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
            >
              {characterCount}/{maxCharacters}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 border border-white/10"
        >
          {loading ? (
            <>
              <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span>Submit Testimonial</span>
            </>
          )}
        </button>
      </div>

      {/* Status Message */}
      {message.text && (
        <div
          className={`mt-3 sm:mt-4 md:mt-6 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border backdrop-blur-sm flex items-start gap-1.5 sm:gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">
            {message.text}
          </p>
        </div>
      )}

      <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-white/10 text-center text-[10px] sm:text-xs text-gray-500">
        🔒 Your testimonial will be reviewed before being published
      </div>
    </div>
  );
};

// ✅ EXPORT - Main Component with Modal Trigger
const ClientTestimonialForm = ({ onClose, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="text-center mt-6 sm:mt-8 md:mt-12 px-2 sm:px-4">
        <button
          onClick={() => setShowModal(true)}
          className="group mx-auto bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white border border-white/20 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Share Your Feedback</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
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
