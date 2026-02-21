import React from "react";
import { Palette, Send } from "lucide-react";

const Footer = ({ scrollToSection }) => {
  return (
    <footer className="relative border-t border-white/10 py-12 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-8 h-8 text-purple-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                YuviArt
              </div>
            </div>
            <p className="text-gray-400">
              Creating timeless art that speaks to the soul
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {["Home", "Gallery", "Shop", "About", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="block text-gray-400 hover:text-purple-400 transition"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <div className="space-y-2">
              {["Portraits", "Sketches", "Paintings", "Custom Art"].map((cat) => (
                <button
                  key={cat}
                  className="block text-gray-400 hover:text-purple-400 transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Get updates on new collections
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 YuviArt. Crafted with passion for art lovers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
