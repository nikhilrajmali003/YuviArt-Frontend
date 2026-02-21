import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  ShoppingCart, 
  X, 
  Heart, 
  ArrowUp, 
  Loader,
  AlertCircle
} from "lucide-react";

// Components
import Navigation from "./components/layout/Navigation";
import AnimatedBackground from "./components/layout/AnimatedBackground";
import Hero from "./components/home/Hero";
import Gallery from "./components/home/Gallery";
import Shop from "./components/home/Shop";
import About from "./components/home/About";
import Testimonials from "./components/home/Testimonials";
import Contact from "./components/home/Contact";
import Footer from "./components/layout/Footer";
import ClientTestimonialForm from "./components/ClientTestimonialForm";

// Services & Data
import api, { getImageUrl, API_BASE_URL } from "./services/api";
import { mockArtworks, mockTestimonials } from "./data/mockData";

// Constants
const USE_MOCK_DATA = false;
const FORMSPREE_FORM_ID = "mvgdadvw";
const ARTIST_EMAIL = "yuviraj7232@gmail.com";

const ArtistPortfolio = () => {
  // --- STATE ---
  const [cart, setCart] = useState([]);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthPage, setShowAuthPage] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);

  // API State
  const [artworks, setArtworks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    artType: "Portrait",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // --- ACTIONS ---
  const fetchTestimonials = useCallback(async () => {
    if (USE_MOCK_DATA) {
      setTestimonials(mockTestimonials);
      return;
    }
    try {
      const apiTestimonials = await api.testimonialAPI.getAll();
      const apiWithPrefix = apiTestimonials.map((testimonial) => ({
        ...testimonial,
        id: testimonial.id ? `api-${testimonial.id}` : `api-${Math.random()}`,
      }));
      setTestimonials(apiWithPrefix);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setTestimonials(mockTestimonials);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    if (USE_MOCK_DATA) {
      setArtworks(mockArtworks);
      setTestimonials(mockTestimonials);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const artworksData = await api.artworkAPI.getAll();
      setArtworks(artworksData);
      await fetchTestimonials();
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setArtworks(mockArtworks);
      setTestimonials(mockTestimonials);
    } finally {
      setLoading(false);
    }
  }, [fetchTestimonials]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const savedUser = localStorage.getItem("yuviart_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("yuviart_user");
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);

      const sections = ["home", "gallery", "shop", "about", "contact", "testimonials"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("yuviart_user", JSON.stringify(userData));
    setShowAuthPage(null);
    if (selectedArtwork) {
      addToCart(selectedArtwork);
      setSelectedArtwork(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("yuviart_user");
    setCart([]);
  };

  const addToCart = (artwork) => {
    if (!cart.find((item) => item.id === artwork.id)) {
      setCart([...cart, artwork]);
    }
  };

  const handleAddToCart = async (artwork) => {
    if (!user) {
      setSelectedArtwork(artwork);
      // We'll let the user handle auth page switching
      window.location.href = '#home'; // Simple fallback
      alert("Please login to add items to cart.");
      return;
    }

    setAddingToCart(artwork.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      addToCart(artwork);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const handleWishlist = (artId) => {
    setWishlistItems((prev) =>
      prev.includes(artId) ? prev.filter((id) => id !== artId) : [...prev, artId]
    );
  };

  const isInWishlist = (artId) => wishlistItems.includes(artId);
  const isInCart = (artId) => cart.some((item) => item.id === artId);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all required fields.");
      return;
    }
    setContactSubmitting(true);
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (!response.ok) throw new Error("Failed to submit");
      setContactSuccess(true);
      setContactForm({ name: "", email: "", artType: "Portrait", message: "" });
      setTimeout(() => setContactSuccess(false), 6000);
    } catch (err) {
      console.error("Error submitting:", err);
      // Fallback mailto logic could go here
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    alert("Proceeding to payment securely...");
    // Integrated with Razorpay/Stripe here in production
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const totalCartValue = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

  const filteredArtworks = useMemo(() => {
    if (selectedCategory === "all") return artworks;
    return artworks.filter((art) => {
      if (Array.isArray(art.category)) return art.category.includes(selectedCategory);
      return art.category === selectedCategory;
    });
  }, [artworks, selectedCategory]);

  // --- RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Amazing Artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatedBackground />
      
      <Navigation 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        user={user}
        handleLogout={handleLogout}
        setShowAuthPage={setShowAuthPage}
        wishlistItems={wishlistItems}
        setWishlistOpen={setWishlistOpen}
        wishlistOpen={wishlistOpen}
        cart={cart}
        setCartOpen={setCartOpen}
        cartOpen={cartOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Hero scrollY={scrollY} scrollToSection={scrollToSection} />

      <Gallery 
        filteredArtworks={filteredArtworks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        getImageUrl={getImageUrl}
      />

      <Shop 
        artworks={artworks}
        filteredArtworks={filteredArtworks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleWishlist={handleWishlist}
        isInWishlist={isInWishlist}
        handleAddToCart={handleAddToCart}
        addingToCart={addingToCart}
        isInCart={isInCart}
        user={user}
        getImageUrl={getImageUrl}
      />

      <About artworksCount={artworks.length} />

      <Testimonials testimonials={testimonials} scrollToSection={scrollToSection} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ClientTestimonialForm onSuccess={fetchTestimonials} />
      </div>

      <Contact 
        contactForm={contactForm}
        setContactForm={setContactForm}
        contactSubmitting={contactSubmitting}
        contactSuccess={contactSuccess}
        handleContactSubmit={handleContactSubmit}
        ARTIST_EMAIL={ARTIST_EMAIL}
      />

      <Footer scrollToSection={scrollToSection} />

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-gray-900 border-l border-white/10 p-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Your Cart</h3>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X /></button>
            </div>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-20">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <img src={getImageUrl(item.imageUrl)} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-purple-400">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                ))}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between text-2xl font-bold mb-6">
                    <span>Total:</span>
                    <span className="text-purple-400">₹{totalCartValue.toLocaleString("en-IN")}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold hover:scale-105 transition-transform">Checkout Now</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Sidebar */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-gray-900 border-l border-white/10 p-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2"><Heart className="fill-pink-400 text-pink-400" /> Wishlist</h3>
              <button onClick={() => setWishlistOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X /></button>
            </div>
            {wishlistItems.length === 0 ? (
              <p className="text-center text-gray-500 py-20">Your wishlist is empty.</p>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((id) => {
                  const art = artworks.find(a => a.id === id);
                  if (!art) return null;
                  return (
                    <div key={id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                      <img src={getImageUrl(art.imageUrl)} alt={art.title} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-bold">{art.title}</h4>
                        <p className="text-pink-400">₹{art.price.toLocaleString("en-IN")}</p>
                        <button onClick={() => handleAddToCart(art)} className="text-xs text-purple-400 mt-2">Add to Cart</button>
                      </div>
                      <button onClick={() => handleWishlist(id)} className="text-pink-400 p-2"><X className="w-5 h-5" /></button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50">
          <ArrowUp className="text-white" />
        </button>
      )}
    </div>
  );
};

export default ArtistPortfolio;
