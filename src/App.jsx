import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Menu, X, Instagram, Youtube, Heart, Star, Send, Mail, Phone, MapPin, ChevronRight, Sparkles, Palette, Award, Users, ArrowUp, Loader } from 'lucide-react';
import ClientTestimonialForm from "./components/ClientTestimonialForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const USE_MOCK_DATA = false;
const FORMSPREE_FORM_ID = 'mvgdadvw';
const ARTIST_EMAIL = 'yuviraj7232@gmail.com';
// Mock data fallback
const mockArtworks = [
  { id: 1, title: 'Shree Krishn', category: 'paintings', price: 2000, imageUrl: '/images/shreeKrishn.jpg', description: 'A soulful depiction of Lord Krishna radiating divine charm, serenity, and eternal love.', rating: 5, available: true },
  { id: 2, title: 'Shree Radha Rani', category: 'sketches', price: 2000, imageUrl: '/images/radharani.jpg', description: 'Graceful and divine, this sketch captures Radha Rani ethereal beauty and pure devotion.', rating: 5, available: true },
  { id: 3, title: 'Mahadev', category: 'paintings', price: 3000, imageUrl: '/images/Mahadev.jpg', description: 'A powerful portrayal of Lord Shiva, symbolizing calm amidst chaos and supreme strength.', rating: 5, available: true },
  { id: 4, title: 'Horses', category: 'sketches', price: 2000, imageUrl: '/images/hourses.jpg', description: 'Dynamic sketch showcasing the grace, freedom, and raw energy of galloping horses.', rating: 4, available: true },
  { id: 5, title: 'Shree Narshing Bhagwan', category: 'custom', price: 2000, imageUrl: '/images/Narshing.jpg', description: 'Mythical and divine — capturing Lord Narasimha fierce power protecting his devotee Prahlad.', rating: 5, available: true },
  { id: 6, title: 'Durga Maa', category: 'paintings', price: 3000, imageUrl: '/images/Durgamaa.jpg', description: 'A stunning artwork of Goddess Durga, symbolizing courage, strength, and divine motherhood.', rating: 5, available: true },
  { id: 7, title: 'Gentle Man', category: ['sketches', 'custom', 'portraits'], price: 2000, imageUrl: '/images/custom.jpg', description: 'A refined pencil portrait capturing sophistication, confidence, and quiet strength.', rating: 4, available: true },
  { id: 8, title: 'Guru Maharaj', category: ['sketches', 'custom', 'portraits'], price: 3000, imageUrl: '/images/guru.jpg', description: 'Spiritual portrait radiating peace, wisdom, and the timeless aura of a revered Guru.', rating: 5, available: true },
  { id: 9, title: 'Sharswati Maa', category: 'paintings', price: 4000, imageUrl: '/images/Sharswatimaa.jpg', description: 'An elegant painting of Goddess Saraswati — the divine muse of wisdom, art, and purity.', rating: 4, available: true },
  { id: 10, title: 'Love Birds', category: ['sketches', 'custom'], price: 2500, imageUrl: '/images/Couple.jpg', description: 'A tender sketch of two love birds symbolizing unity, affection, and eternal companionship.', rating: 5, available: true },
  { id: 11, title: 'Mother and Child', category: ['sketches', 'custom'], price: 2000, imageUrl: '/images/mother.jpg', description: 'Heartwarming sketch depicting the pure, unconditional bond between a mother and her child.', rating: 5, available: true },
  { id: 12, title: 'Cutie', category: ['sketches', 'custom', 'portraits'], price: 2000, imageUrl: '/images/child.jpg', description: 'Adorable portrait of a cheerful child, full of innocence, laughter, and pure joy.', rating: 5, available: true },
  { id: 13, title: 'Lord Ganesh', category: 'sketches', price: 2000, imageUrl: '/images/ganesh.jpg', description: 'Delicate sketch of Lord Ganesha bringing wisdom, peace, and auspicious beginnings.', rating: 4, available: true },
  { id: 14, title: 'Lord Vishnu', category: 'paintings', price: 3000, imageUrl: '/images/LordVishnu.jpg', description: 'A divine portrayal of Lord Vishnu exuding calmness, balance, and supreme protection.', rating: 5, available: true }
];

const mockTestimonials = [
  { id: 'mock-1', name: 'Priya Sharma', rating: 5, text: 'Absolutely breathtaking! Every stroke tells a story. The portrait exceeded my wildest expectations.', approved: true },
  { id: 'mock-2', name: 'Rahul Verma', rating: 5, text: 'Exceptional talent and professionalism. The attention to detail is simply remarkable.', approved: true },
  { id: 'mock-3', name: 'Anita Desai', rating: 5, text: 'A true artist with an incredible gift. The custom piece brought tears to my eyes.', approved: true }
];

const ArtistPortfolio = () => {
  const [cart, setCart] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthPage, setShowAuthPage] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // API State
  const [artworks, setArtworks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    artType: 'Portrait',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    if (USE_MOCK_DATA) {
      setTestimonials(mockTestimonials);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      
      const apiTestimonials = await response.json();
      const apiWithPrefix = apiTestimonials.map(testimonial => ({
        ...testimonial,
        id: testimonial.id ? `api-${testimonial.id}` : `api-${Math.random()}`
      }));
      
      setTestimonials([...mockTestimonials, ...apiWithPrefix]);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setTestimonials(mockTestimonials);
    }
  };

  // Fetch All Data
  useEffect(() => {
    const fetchAllData = async () => {
      if (USE_MOCK_DATA) {
        setArtworks(mockArtworks);
        setTestimonials(mockTestimonials);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const artworksResponse = await fetch(`${API_BASE_URL}/artworks`);
        if (artworksResponse.ok) {
          const artworksData = await artworksResponse.json();
          setArtworks([...mockArtworks, ...artworksData]);
        } else {
          setArtworks(mockArtworks);
        }

        await fetchTestimonials();
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setArtworks(mockArtworks);
        setTestimonials(mockTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('yuviart_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('yuviart_user');
      }
    }
  }, []);
  
  // Scroll and Mouse Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);
      
      const sections = ['home', 'gallery', 'shop', 'about', 'contact', 'testimonials'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('yuviart_user', JSON.stringify(userData));
    setShowAuthPage(null);
    
    if (selectedArtwork) {
      addToCart(selectedArtwork);
      setSelectedArtwork(null);
    }
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('yuviart_user', JSON.stringify(userData));
    setShowAuthPage(null);
    
    if (selectedArtwork) {
      addToCart(selectedArtwork);
      setSelectedArtwork(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('yuviart_user');
    setCart([]);
  };

  const handleAddToCart = (artwork) => {
    if (!user) {
      setSelectedArtwork(artwork);
      setShowAuthPage('login');
    } else {
      addToCart(artwork);
    }
  };

  // Cart Functions
  const addToCart = (artwork) => {
    setCart([...cart, artwork]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Contact Form Submit
  // Handle Contact Form Submit
  const handleContactSubmit = async (e) => {
     e.preventDefault();
     
     // Validate form fields
     if (!contactForm.name || !contactForm.email || !contactForm.message) {
       alert('⚠️ Please fill in all required fields (Name, Email, Message)');
       return;
     }

     // Email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(contactForm.email)) {
       alert('⚠️ Please enter a valid email address');
       return;
     }
     
     setContactSubmitting(true);
     
     try {
       // Send email directly using Formspree
       const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           name: contactForm.name,
           email: contactForm.email,
           artType: contactForm.artType,
           message: contactForm.message,
           _replyto: contactForm.email,
           _subject: `🎨 YuviArt Commission Request - ${contactForm.artType} from ${contactForm.name}`,
           _template: 'table',
           submittedAt: new Date().toLocaleString('en-IN', { 
             timeZone: 'Asia/Kolkata',
             dateStyle: 'full',
             timeStyle: 'long'
           })
         })
       });
       
       if (!response.ok) {
         throw new Error('Failed to submit commission request');
       }
       
       // Success!
       setContactSuccess(true);
       const submittedEmail = contactForm.email;
       setContactForm({ name: '', email: '', artType: 'Portrait', message: '' });
       
       // Show success message for 6 seconds
       setTimeout(() => setContactSuccess(false), 6000);
       
       console.log('✅ Commission request sent successfully to:', ARTIST_EMAIL);
       
     } catch (err) {
       console.error('❌ Error submitting commission request:', err);
       
       // Fallback: Open default email client with pre-filled form
       const subject = encodeURIComponent(`🎨 YuviArt Commission Request - ${contactForm.artType}`);
       const body = encodeURIComponent(
         `Hello,\n\n` +
         `I would like to commission a ${contactForm.artType}.\n\n` +
         `--- Contact Details ---\n` +
         `Name: ${contactForm.name}\n` +
         `Email: ${contactForm.email}\n\n` +
         `--- Commission Details ---\n` +
         `Art Type: ${contactForm.artType}\n\n` +
         `Message:\n${contactForm.message}\n\n` +
         `---\n` +
         `Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n` +
         `From: YuviArt Website`
       );
       
       // Open email client
       window.location.href = `mailto:${ARTIST_EMAIL}?subject=${subject}&body=${body}`;
       
       alert('📧 Opening your email client...\n\nPlease click "Send" to complete your commission request.\n\nIf your email client doesn\'t open, please email directly to:\nyuviraj7232@gmail.com');
     } finally {
       setContactSubmitting(false);
     }
   };
  
  // Checkout Handler
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const orderData = {
      customerName: user?.name || 'Customer Name',
      customerEmail: user?.email || 'customer@example.com',
      customerPhone: '+91 9876543210',
      shippingAddress: 'Customer Address',
      items: cart.map(item => ({
        artwork: { id: item.id },
        quantity: 1,
        price: item.price
      })),
      paymentMethod: 'razorpay'
    };

    if (USE_MOCK_DATA) {
      alert(`Order created successfully!\nTotal: ₹${totalCartValue}\nItems: ${cart.length}`);
      setCart([]);
      setCartOpen(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) throw new Error('Failed to create order');
      
      const order = await response.json();
      alert(`Order created successfully! Order ID: ${order.id}`);
      setCart([]);
      setCartOpen(false);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create order. Please try again.');
    }
  };

  // Filtered Artworks
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'all') return artworks;
    return artworks.filter(art => {
      if (Array.isArray(art.category)) {
        return art.category.includes(selectedCategory);
      }
      return art.category === selectedCategory;
    });
  }, [artworks, selectedCategory]);

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartValue = cart.reduce((sum, item) => sum + item.price, 0);

  // Show Auth Pages
  if (showAuthPage === 'login') {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setShowAuthPage('signup')}
        onClose={() => {
          setShowAuthPage(null);
          setSelectedArtwork(null);
        }}
        selectedArtwork={selectedArtwork}
      />
    );
  }

  if (showAuthPage === 'signup') {
    return (
      <Signup 
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setShowAuthPage('login')}
        onClose={() => {
          setShowAuthPage(null);
          setSelectedArtwork(null);
        }}
        selectedArtwork={selectedArtwork}
      />
    );
  }

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
      {/* API Status Banner */}
      {USE_MOCK_DATA && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500/90 text-black px-4 py-2 rounded-full text-sm font-semibold">
          Using Mock Data - Start Backend to Enable Real API
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-rose-900/20" />
        <div 
          className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Palette className="w-8 h-8 text-purple-400" />
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                YuviArt
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'gallery', 'shop', 'about', 'testimonials', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all duration-300 relative group ${
                    activeSection === section ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {section}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform transition-transform ${
                    activeSection === section ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
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
                  onClick={() => setShowAuthPage('login')}
                  className="hidden md:block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  Sign In
                </button>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setCartOpen(!cartOpen)}
                  className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
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
            {['home', 'gallery', 'shop', 'about', 'testimonials', 'contact'].map(section => (
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

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-l border-white/10 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Your Cart</h3>
              <button 
                onClick={() => setCartOpen(false)}
                className="hover:bg-white/10 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your cart is empty</p>
                <p className="text-gray-500 text-sm mt-2">Add some amazing artworks!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, idx) => (
                    <div 
                      key={`cart-${item.id}-${idx}`}
                      className="flex gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-purple-400 font-medium">₹{item.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Items:</span>
                      <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ₹{totalCartValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full bg-white/5 text-white py-3 rounded-lg font-medium hover:bg-white/10 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
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
                  onClick={() => scrollToSection('shop')}
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  Explore Gallery
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Commission Art
                </button>
              </div>
              <div className="flex gap-4 pt-4">
                {[
                  { icon: Instagram, url: 'https://www.instagram.com/yuviart11/' },
                  { icon: Youtube, url: 'https://www.youtube.com/@artistyuviraj9363' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:border-purple-400 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
            <div className="relative" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl blur-3xl" />
              <img 
                src="/images/yuviart.jpg" 
                alt="Artist workspace" 
                className="relative rounded-3xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10">
                <p className="text-4xl font-bold">10+</p>
                <p className="text-sm opacity-90">Years Mastery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '500+', label: 'Happy Clients' },
              { icon: Palette, value: `${artworks.length}+`, label: 'Artworks' },
              { icon: Award, value: '15+', label: 'Awards Won' },
              { icon: Star, value: '4.9', label: 'Rating' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <stat.icon className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Portfolio Showcase
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Curated masterpieces across various art forms</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'sketches', 'portraits', 'paintings', 'custom'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArtworks.map(art => (
              <div 
                key={art.id} 
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-xl mb-2">{art.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{art.description}</p>
                      <div className="flex gap-1">
                        {[...Array(art.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Exclusive Collection
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Own a piece of timeless artistry</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.slice(0, 6).map((art) => (
              <div
                key={art.id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                    <Heart className="w-5 h-5 text-white hover:fill-pink-400 hover:text-pink-400 transition-all" />
                  </button>
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {[...Array(art.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{art.title}</h3>
                  <p className="text-gray-400 mb-4">{art.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ₹{art.price}
                    </span>

                    <button
                      onClick={() => handleAddToCart(art)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      {user ? "Add to Cart" : "Sign in to Buy"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-full">
              <span className="text-gray-300 font-semibold">Secure Payments:</span>
              <div className="flex gap-4 text-sm font-bold">
                <span className="text-blue-400">Razorpay</span>
                <span className="text-blue-400">PayPal</span>
                <span className="text-purple-400">Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600" 
                alt="Artist" 
                className="relative rounded-3xl shadow-2xl border border-white/10"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  The Artist
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                With over a decade of dedication to the craft, I've transformed countless visions into tangible masterpieces. My journey began with a simple pencil and paper, evolving into a diverse portfolio that spans multiple mediums and styles.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Each artwork is a collaboration between artist and client, a fusion of technical skill and emotional resonance. I believe that art should not just be seen, but felt—capturing moments, memories, and emotions that last a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-400/30 p-6 rounded-2xl">
                  <p className="text-4xl font-bold text-purple-400 mb-2">500+</p>
                  <p className="text-gray-300">Satisfied Clients</p>
                </div>
                <div className="bg-gradient-to-br from-pink-600/20 to-transparent border border-pink-400/30 p-6 rounded-2xl">
                  <p className="text-4xl font-bold text-pink-400 mb-2">{artworks.length}+</p>
                  <p className="text-gray-300">Artworks Created</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Client Stories
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Testimonials from art enthusiasts worldwide</p>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full">
              <span className="text-green-300 text-sm font-medium">
                ✓ {testimonials.length} verified testimonial{testimonials.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {testimonials && testimonials.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials
                .filter(t => t.text || t.testimonial)
                .map((testimonial, index) => (
                  <div 
                    key={testimonial.id || `testimonial-${index}`} 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 relative"
                  >
                    <div className="absolute top-4 right-4 bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30 font-medium">
                      ✓ Verified
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-6 italic min-h-[100px] leading-relaxed">
                      "{testimonial.text || testimonial.testimonial || 'Great experience!'}"
                    </p>
                    
                    <div className="border-t border-white/10 pt-4">
                      <p className="font-semibold text-purple-400 text-lg">
                        {testimonial.name || 'Anonymous'}
                      </p>
                      {testimonial.email && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {testimonial.email}
                        </p>
                      )}
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
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-2xl mx-auto">
                <Star className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No testimonials yet.</p>
                <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
              </div>
            </div>
          )}

          <ClientTestimonialForm onSuccess={fetchTestimonials} />
        </div>
      </section>

      {/* Contact Section */}
	  {/* Contact Section */}
	  <section id="contact" className="relative py-20 z-10">
	    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	      <div className="text-center mb-16">
	        <h2 className="text-5xl md:text-6xl font-bold mb-4">
	          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
	            Let's Create Together
	          </span>
	        </h2>
	        <p className="text-gray-400 text-lg">Commission your dream artwork today</p>
	      </div>

	      <div className="grid lg:grid-cols-2 gap-12">
	        <div className="space-y-6">
	          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
	            <h3 className="text-2xl font-bold mb-6">Commission Request</h3>
	            
	            {contactSuccess && (
	              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 animate-fadeIn">
	                <div className="flex items-center gap-2 mb-2">
	                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
	                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
	                  </svg>
	                  <strong>Success!</strong>
	                </div>
	                <p className="text-sm">Your commission request has been sent to the artist. We'll contact you soon at <strong>{contactForm.email || 'your email'}</strong>!</p>
	              </div>
	            )}

	            <div className="space-y-4">
	              <input 
	                type="text" 
	                placeholder="Your Name *"
	                value={contactForm.name}
	                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
	                required
	                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all"
	              />
	              <input 
	                type="email" 
	                placeholder="Email Address *"
	                value={contactForm.email}
	                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
	                required
	                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all"
	              />
	              <select 
	                value={contactForm.artType}
	                onChange={(e) => setContactForm({...contactForm, artType: e.target.value})}
	                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-all"
	              >
	                <option className="bg-gray-900" value="Portrait">Portrait</option>
	                <option className="bg-gray-900" value="Sketch">Sketch</option>
	                <option className="bg-gray-900" value="Painting">Painting</option>
	                <option className="bg-gray-900" value="Custom Design">Custom Design</option>
	              </select>
	              <textarea 
	                placeholder="Describe your vision... *"
	                value={contactForm.message}
	                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
	                required
	                rows="4"
	                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all resize-none"
	              />
	              <button 
	                onClick={handleContactSubmit}
	                disabled={contactSubmitting}
	                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
	              >
	                {contactSubmitting ? (
	                  <>
	                    <Loader className="w-5 h-5 animate-spin" />
	                    Sending Request...
	                  </>
	                ) : (
	                  <>
	                    <Send className="w-5 h-5" />
	                    Send Commission Request
	                  </>
	                )}
	              </button>
	              <p className="text-xs text-gray-400 text-center">* Required fields</p>
	            </div>
	          </div>
	        </div>

	        <div className="space-y-6">
	          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
	            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
	            <div className="space-y-4">
	              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all">
	                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
	                  <Mail className="w-6 h-6" />
	                </div>
	                <div>
	                  <p className="font-semibold">Email</p>
	                  <p className="text-gray-400">yuviraj7232@gmail.com</p>
	                </div>
	              </div>
	              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all">
	                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
	                  <Phone className="w-6 h-6" />
	                </div>
	                <div>
	                  <p className="font-semibold">Phone</p>
	                  <p className="text-gray-400">+91 72328 41603</p>
	                </div>
	              </div>
	              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all">
	                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
	                  <MapPin className="w-6 h-6" />
	                </div>
	                <div>
	                  <p className="font-semibold">Location</p>
	                  <p className="text-gray-400">Udaipur, Rajasthan, India</p>
	                </div>
	              </div>
	            </div>

	            <div className="mt-8">
	              <p className="font-semibold mb-4">Connect With Me</p>
	              <div className="flex gap-3">
	                {[
	                  { icon: Instagram, gradient: 'from-purple-600 to-pink-600', url: 'https://www.instagram.com/yuviart11/' },
	                  { icon: Youtube, gradient: 'from-red-600 to-red-500', url: 'https://www.youtube.com/@artistyuviraj9363' }
	                ].map((social, idx) => (
	                  <a
	                    key={idx}
	                    href={social.url}
	                    target="_blank"
	                    rel="noopener noreferrer"
	                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${social.gradient} flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg`}
	                  >
	                    <social.icon className="w-6 h-6 text-white" />
	                  </a>
	                ))}
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
	  </section>	

      {/* Footer */}
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
              <p className="text-gray-400">Creating timeless art that speaks to the soul</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['Home', 'Gallery', 'Shop', 'About', 'Contact'].map(link => (
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
                {['Portraits', 'Sketches', 'Paintings', 'Custom Art'].map(cat => (
                  <button key={cat} className="block text-gray-400 hover:text-purple-400 transition">
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4 text-sm">Get updates on new collections</p>
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
            <p className="text-gray-400">© 2025 YuviArt. Crafted with passion for art lovers worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ArtistPortfolio;