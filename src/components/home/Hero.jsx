import React from "react";
import { Sparkles, ChevronRight, Instagram, Youtube, Phone } from "lucide-react";

const Hero = ({ scrollY, scrollToSection }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className="space-y-8 z-20"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm text-gray-300 font-medium">Premium Art Collections</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Where Art
              </span>
              <br />
              <span className="text-white drop-shadow-lg">Meets Soul</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              Immerse yourself in a world of extraordinary artistry. Each piece is meticulously crafted to capture the essence of emotion and beauty.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("shop")}
                className="group relative bg-purple-600 text-white px-8 py-4 rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-transform group-hover:scale-110" />
                <span className="relative flex items-center gap-2">
                  Explore Gallery
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-all"
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
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 hover:border-purple-500/50"
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Right side - Hero Photo Container */}
          <div 
            className="relative lg:block mt-12 lg:mt-0"
            style={{ 
              transform: `translateY(${scrollY * -0.05}px)`,
              perspective: "1000px"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl animate-pulse" />
            
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)] group transform transition-transform duration-700 hover:rotate-2">
              <img
                src="/images/yuviart.jpg"
                alt="YuviArt Studio"
                className="w-full h-auto min-h-[400px] object-cover transition-all duration-1000 group-hover:scale-110"
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x800?text=Artist+Studio";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-4xl font-black text-white mb-1">10+</p>
                <p className="text-purple-400 text-xs font-bold tracking-[0.2em] uppercase">Years Of Art Mastery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
