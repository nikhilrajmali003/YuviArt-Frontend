import React from "react";
import { Star, MessageSquare } from "lucide-react";

const Testimonials = ({ testimonials, scrollToSection }) => {
  return (
    <section id="testimonials" className="relative py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Client Voice
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Experiences from art collectors worldwide</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.filter(t => t.approved || t.id.startsWith('mock-')).map((testi, idx) => (
            <div
              key={testi.id || idx}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">"{testi.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-xl">
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{testi.name}</p>
                  <p className="text-purple-400 text-sm">Fine Art Collector</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default React.memo(Testimonials);
