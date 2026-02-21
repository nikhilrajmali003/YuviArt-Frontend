import React from "react";
import { 
  Palette, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X 
} from "lucide-react";

const Navigation = ({
  activeSection,
  scrollToSection,
  user,
  handleLogout,
  setShowAuthPage,
  wishlistItems,
  setWishlistOpen,
  wishlistOpen,
  cart,
  setCartOpen,
  cartOpen,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Palette className="w-8 h-8 text-purple-400" />
            <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]">
              YuviArt
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {["home", "gallery", "shop", "about", "testimonials", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize transition-all duration-300 relative group ${
                  activeSection === section ? "text-purple-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {section}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform transition-transform ${
                    activeSection === section ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-300">Welcome,</p>
                  <p className="text-sm font-semibold text-purple-400">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthPage("login")}
                className="hidden md:block px-6 py-2 bg-purple-800 hover:bg-purple-600 rounded-full text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                LogIn
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className="relative p-2 rounded-full bg-white/5 hover:bg-red-400 transition-all duration-300 group"
              >
                <Heart className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 rounded-full bg-purple-800 hover:bg-purple-600 transition-all duration-300 group"
              >
                <ShoppingCart className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
          {["home", "gallery", "shop", "about", "testimonials", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="block w-full text-left px-6 py-4 capitalize hover:bg-white/5 transition"
            >
              {section}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navigation);
