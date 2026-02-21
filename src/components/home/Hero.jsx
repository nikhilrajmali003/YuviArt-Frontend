import React from "react";
import { Sparkles, ChevronRight, Instagram, Youtube, Phone } from "lucide-react";

const Hero = ({ scrollY, scrollToSection }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className="space-y-8"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Premium Art Collections</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Where Art
              </span>
              <br />
              <span className="text-white">Meets Soul</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
              Immerse yourself in a world of extraordinary artistry. Each piece is meticulously crafted to capture the essence of emotion and beauty.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("shop")}
                className="group bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-700 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-fuchsia-500/40 transition-all duration-300 flex items-center gap-2"
              >
                Explore Gallery
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="group bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-700 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-fuchsia-500/40 transition-all duration-300 flex items-center gap-2"
              >
                Commission Art
              </button>
            </div>
            <div className="flex gap-4 pt-4">
              {[
                { icon: Instagram, link: "https://www.instagram.com/yuvi_raj_art/" },
                { icon: Youtube, link: "https://www.youtube.com/@yuvirajart" },
                { icon: Phone, link: "tel:9521367232" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10"
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
