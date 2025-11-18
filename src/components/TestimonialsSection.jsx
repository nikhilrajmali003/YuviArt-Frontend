// ==================================================
// FILE: src/components/TestimonialsSection.jsx
// ==================================================

import React from 'react';
import { Star } from 'lucide-react';
import ClientTestimonialForm from './ClientTestimonialForm';

/**
 * Testimonials Section Component
 * Displays client testimonials and feedback form
 * 
 * Props:
 * - testimonials: Array of testimonial objects
 * - onRefresh: Callback function to refresh testimonials after submission
 */
const TestimonialsSection = ({ testimonials = [], onRefresh }) => {
  return (
    <section id="testimonials" className="relative py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Client Stories
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Testimonials from art enthusiasts worldwide
          </p>
        </div>

        {/* Debug Counter - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mb-8">
            <span className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium">
              📊 {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} loaded
            </span>
          </div>
        )}

        {/* Testimonials Grid or Empty State */}
        {testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <EmptyTestimonials />
        )}

        {/* Testimonial Form */}
        <ClientTestimonialForm onSuccess={onRefresh} />
      </div>
    </section>
  );
};

/**
 * Individual Testimonial Card Component
 */
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating || 5)].map((_, i) => (
          <Star 
            key={i} 
            className="w-5 h-5 fill-yellow-400 text-yellow-400" 
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-300 mb-6 italic min-h-[80px] leading-relaxed">
        "{testimonial.text || testimonial.testimonial || 'Amazing experience!'}"
      </p>

      {/* Author Info */}
      <div className="border-t border-white/10 pt-4">
        <p className="font-semibold text-purple-400 text-lg">
          {testimonial.name || 'Anonymous'}
        </p>
        {testimonial.createdAt && (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyTestimonials = () => {
  return (
    <div className="text-center py-16 mb-12">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-2xl mx-auto">
        <div className="mb-6">
          <Star className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          No Testimonials Yet
        </h3>
        <p className="text-gray-400 text-lg mb-2">
          Be the first to share your experience!
        </p>
        <p className="text-gray-500 text-sm">
          Your feedback helps us create better art for everyone.
        </p>
      </div>
    </div>
  );
};

export default TestimonialsSection;