import React, { useState, useEffect, useMemo } from "react";
import {
  Upload,
  Trash2,
  Check,
  X,
  Menu,
  Search,
  AlertCircle,
  Loader,
  Image,
  LogOut,
  Package,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  BarChart3,
  Users,
  ShoppingCart,
  Activity,
} from "lucide-react";

import { API_BASE_URL } from "../services/api.js"; // Adjust path as needed

const EnhancedAdminPanel = ({ onLogout, onNavigateToSignup }) => {
  const [artworks, setArtworks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const MOCK_ARTWORKS_COUNT = 14;
  const MOCK_TESTIMONIALS_COUNT = 3;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "portraits",
    price: "",
    rating: 5,
    stockQuantity: 1,
    available: true,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchArtworks();
    fetchTestimonials();
  }, []);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/artworks`);
      if (response.ok) {
        const data = await response.json();
        setArtworks(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/all`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be less than 5MB" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please select a valid image" });
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.description.trim())
      newErrors.description = "Description required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price required";
    if (!selectedImage && !imagePreview) newErrors.image = "Image required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
      if (onNavigateToSignup) onNavigateToSignup();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append("image", selectedImage);

      const response = await fetch(`${API_BASE_URL}/artworks/with-image`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        showSuccess("✅ Artwork uploaded successfully!");
        setFormData({
          title: "",
          description: "",
          category: "portraits",
          price: "",
          rating: 5,
          stockQuantity: 1,
          available: true,
        });
        setSelectedImage(null);
        setImagePreview(null);
        setErrors({});
        fetchArtworks();
      } else {
        alert("❌ Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error uploading");
    } finally {
      setUploading(false);
    }
  };

  const deleteArtwork = async (id) => {
    if (window.confirm("Delete this artwork?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          showSuccess("✅ Deleted successfully!");
          fetchArtworks();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const approveTestimonial = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testimonials/${id}/approve`,
        { method: "PUT" },
      );
      if (response.ok) {
        showSuccess("✅ Approved!");
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTestimonial = async (id) => {
    if (window.confirm("Delete this testimonial?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          showSuccess("✅ Deleted!");
          fetchTestimonials();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesSearch =
        artwork.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || artwork.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [artworks, searchQuery, filterCategory]);

  const pendingTestimonials = useMemo(
    () => testimonials.filter((t) => !t.approved),
    [testimonials],
  );

  const stats = {
    totalArtworks: artworks.length + MOCK_ARTWORKS_COUNT,
    totalRevenue:
      artworks.reduce((sum, a) => sum + (a.price || 0), 0) +
      MOCK_ARTWORKS_COUNT * 2500,
    totalTestimonials: testimonials.length + MOCK_TESTIMONIALS_COUNT,
    avgRating: (
      artworks.reduce((sum, a) => sum + (a.rating || 0), 0) / artworks.length ||
      4.8
    ).toFixed(1),
  };

  const dynamicAnalytics = useMemo(() => {
    const totalArtworksCount = artworks.length + MOCK_ARTWORKS_COUNT;
    const totalTestimonialsCount =
      testimonials.length + MOCK_TESTIMONIALS_COUNT;
    const categoryBreakdown = artworks.reduce((acc, artwork) => {
      const cat = artwork.category || "custom";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    categoryBreakdown["paintings"] = (categoryBreakdown["paintings"] || 0) + 5;
    categoryBreakdown["sketches"] = (categoryBreakdown["sketches"] || 0) + 7;
    categoryBreakdown["custom"] = (categoryBreakdown["custom"] || 0) + 6;
    categoryBreakdown["portraits"] = (categoryBreakdown["portraits"] || 0) + 4;

    const totalArtworks = totalArtworksCount || 1;
    const baseViews = totalArtworksCount * 150;
    const totalViews =
      baseViews + Math.floor(Math.random() * totalArtworksCount * 50);
    const totalOrders =
      Math.floor(totalTestimonialsCount * 0.65) +
      Math.floor(totalArtworksCount * 0.15);

    return {
      totalViews: totalViews || 2100,
      todayViews: Math.floor(totalViews * 0.025) || 52,
      weeklyViews: Math.floor(totalViews * 0.16) || 336,
      monthlyViews: Math.floor(totalViews * 0.65) || 1365,
      totalOrders: totalOrders || 4,
      pendingOrders: Math.floor(totalOrders * 0.12) || 1,
      completedOrders:
        totalOrders - Math.floor(totalOrders * 0.12) || totalOrders,
      activeUsers: Math.floor(totalViews * 0.04) || 84,
      chartData: [
        {
          day: "Mon",
          views: Math.floor(totalViews * 0.13),
          orders: Math.floor(totalOrders * 0.13),
        },
        {
          day: "Tue",
          views: Math.floor(totalViews * 0.15),
          orders: Math.floor(totalOrders * 0.15),
        },
        {
          day: "Wed",
          views: Math.floor(totalViews * 0.14),
          orders: Math.floor(totalOrders * 0.14),
        },
        {
          day: "Thu",
          views: Math.floor(totalViews * 0.16),
          orders: Math.floor(totalOrders * 0.17),
        },
        {
          day: "Fri",
          views: Math.floor(totalViews * 0.15),
          orders: Math.floor(totalOrders * 0.15),
        },
        {
          day: "Sat",
          views: Math.floor(totalViews * 0.17),
          orders: Math.floor(totalOrders * 0.18),
        },
        {
          day: "Sun",
          views: Math.floor(totalViews * 0.1),
          orders: Math.floor(totalOrders * 0.08),
        },
      ],
      categoryViews:
        Object.keys(categoryBreakdown).length > 0
          ? Object.keys(categoryBreakdown)
              .map((cat) => {
                const count = categoryBreakdown[cat];
                const percentage = Math.floor((count / totalArtworks) * 100);
                const views = Math.floor((totalViews * percentage) / 100);
                return {
                  category: cat.charAt(0).toUpperCase() + cat.slice(1),
                  views: views,
                  percentage: percentage,
                };
              })
              .sort((a, b) => b.percentage - a.percentage)
          : [{ category: "No Data", views: 0, percentage: 0 }],
    };
  }, [artworks, testimonials]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#0b3a6a_0%,_#020617_70%)] text-white">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0c1e35]/90 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Package className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                  YuviArt Admin
                </h1>

                <p className="text-xs text-cyan-300/70">Management Dashboard</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/50 rounded-xl transition-all duration-300 text-red-400 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: "dashboard", icon: BarChart3, label: "Dashboard" },
            {
              id: "artworks",
              icon: Package,
              label: `Artworks (${artworks.length})`,
            },
            { id: "upload", icon: Upload, label: "Upload New" },
            {
              id: "testimonials",
              icon: MessageSquare,
              label: `Reviews (${pendingTestimonials.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-[#0c1e35]/50 text-cyan-300/70 hover:bg-[#0c1e35]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-300"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-100 mb-6">
              Dashboard Overview
            </h2>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Package,
                  label: "Total Artworks",
                  value: stats.totalArtworks,
                  color: "from-cyan-600 to-blue-600",
                  trend: "+12%",
                },
                {
                  icon: DollarSign,
                  label: "Total Value",
                  value: `₹${stats.totalRevenue.toLocaleString()}`,
                  color: "from-green-600 to-emerald-600",
                  trend: "+8.5%",
                },
                {
                  icon: Eye,
                  label: "Total Views",
                  value: dynamicAnalytics.totalViews.toLocaleString(),
                  color: "from-blue-600 to-indigo-600",
                  trend: "+15.3%",
                },
                {
                  icon: Star,
                  label: "Avg Rating",
                  value: stats.avgRating,
                  color: "from-yellow-600 to-orange-600",
                  trend: "4.8/5",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#0c1e35]/50 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/30 hover:border-cyan-500/40 transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-cyan-300/70 text-sm mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-cyan-100">
                      {stat.value}
                    </p>
                    <span className="text-green-400 text-xs font-semibold">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-5 rounded-2xl hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-300 text-sm">Today's Views</span>
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold text-cyan-100">
                  {dynamicAnalytics.todayViews}
                </p>
              </div>
              <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-5 rounded-2xl hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-300 text-sm">Weekly Views</span>
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-cyan-100">
                  {dynamicAnalytics.weeklyViews.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-5 rounded-2xl hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-300 text-sm">Total Orders</span>
                  <ShoppingCart className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-cyan-100">
                  {dynamicAnalytics.totalOrders}
                </p>
              </div>
              <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-5 rounded-2xl hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-300 text-sm">Active Users</span>
                  <Users className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-2xl font-bold text-cyan-100">
                  {dynamicAnalytics.activeUsers}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity Chart */}
              <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-500/40 transition-all">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-100">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Weekly Activity
                </h3>
                <div className="space-y-4">
                  {dynamicAnalytics.chartData.map((data, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-300/70">{data.day}</span>
                        <span className="text-cyan-100 font-semibold">
                          {data.views} views · {data.orders} orders
                        </span>
                      </div>
                      <div className="relative h-2 bg-[#0a1a2e] rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (data.views /
                                Math.max(
                                  ...dynamicAnalytics.chartData.map(
                                    (d) => d.views,
                                  ),
                                )) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-500/40 transition-all">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-100">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Category Performance
                </h3>
                <div className="space-y-5">
                  {dynamicAnalytics.categoryViews.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-cyan-100 font-semibold">
                          {cat.category}
                        </span>
                        <span className="text-cyan-300/70 text-sm">
                          {cat.views.toLocaleString()} views
                        </span>
                      </div>
                      <div className="relative h-3 bg-[#0a1a2e] rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? "bg-gradient-to-r from-cyan-500 to-cyan-400"
                              : idx === 1
                                ? "bg-gradient-to-r from-blue-600 to-blue-400"
                                : idx === 2
                                  ? "bg-gradient-to-r from-green-600 to-green-400"
                                  : "bg-gradient-to-r from-indigo-600 to-indigo-400"
                          }`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-cyan-400/50">
                        {cat.percentage}% of total views
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 text-cyan-100">
                Order Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">
                    {dynamicAnalytics.completedOrders}
                  </p>
                  <p className="text-cyan-300/70 text-sm mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">
                    {dynamicAnalytics.pendingOrders}
                  </p>
                  <p className="text-cyan-300/70 text-sm mt-1">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">
                    {stats.totalTestimonials}
                  </p>
                  <p className="text-cyan-300/70 text-sm mt-1">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {activeTab === "upload" && (
          <div className="bg-[#0c1e35]/50 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-cyan-100">
              <Upload className="w-6 h-6 text-cyan-400" />
              Upload New Artwork
            </h2>
            <div className="space-y-5">
              {/* Image Upload with Preview */}
              <div>
                <label className="block mb-3 font-semibold text-cyan-200">
                  Artwork Image *
                </label>
                <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 text-center hover:border-cyan-400/50 transition-all duration-300 cursor-pointer bg-[#0a1a2e]/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-80 mx-auto rounded-xl shadow-2xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-full transition-all shadow-xl hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
                          <Image className="w-10 h-10 text-cyan-400" />
                        </div>
                        <p className="text-lg font-semibold text-cyan-300 mb-2">
                          Click to upload artwork image
                        </p>
                        <p className="text-cyan-400/60 text-sm">
                          Max 5MB • JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.image && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-sm text-cyan-200">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter artwork title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`w-full px-4 py-3.5 bg-[#0a1a2e]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-cyan-100 placeholder-cyan-400/30 ${
                      errors.title
                        ? "border-red-500"
                        : "border-cyan-500/20 focus:border-cyan-400/50"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm text-cyan-200">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3.5 bg-[#0a1a2e]/50 border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400/50 text-cyan-100"
                  >
                    <option value="portraits">Portraits</option>
                    <option value="sketches">Sketches</option>
                    <option value="paintings">Paintings</option>
                    <option value="custom">Custom Art</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm text-cyan-200">
                  Description *
                </label>
                <textarea
                  placeholder="Describe this artwork..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full px-4 py-3.5 bg-[#0a1a2e]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-cyan-100 placeholder-cyan-400/30 ${
                    errors.description
                      ? "border-red-500"
                      : "border-cyan-500/20 focus:border-cyan-400/50"
                  }`}
                  rows="4"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-sm text-cyan-200">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="2000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className={`w-full px-4 py-3.5 bg-[#0a1a2e]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-cyan-100 placeholder-cyan-400/30 ${
                      errors.price
                        ? "border-red-500"
                        : "border-cyan-500/20 focus:border-cyan-400/50"
                    }`}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm text-cyan-200">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3.5 bg-[#0a1a2e]/50 border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400/50 text-cyan-100"
                    min="1"
                    max="5"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm text-cyan-200">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3.5 bg-[#0a1a2e]/50 border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400/50 text-cyan-100"
                    min="1"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95"
              >
                {uploading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Uploading Artwork...
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    Upload Artwork
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Artworks Management */}
        {activeTab === "artworks" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0c1e35]/50 border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400/50 text-cyan-100 placeholder-cyan-400/30"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3.5 bg-[#0c1e35]/50 border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400/50 sm:w-48 text-cyan-100"
              >
                <option value="all">All Categories</option>
                <option value="portraits">Portraits</option>
                <option value="sketches">Sketches</option>
                <option value="paintings">Paintings</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader className="w-10 h-10 animate-spin text-cyan-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-[#0c1e35]/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-cyan-500/30"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={
                          artwork.imageUrl?.startsWith("http")
                            ? artwork.imageUrl
                            : `http://localhost:8080${artwork.imageUrl}`
                        }
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteArtwork(artwork.id)}
                          className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-xl transition-all shadow-xl hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-1 truncate text-cyan-100">
                        {artwork.title}
                      </h3>
                      <p className="text-cyan-300/70 text-sm mb-3 capitalize flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {artwork.category}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          ₹{artwork.price}
                        </span>
                        <span className="text-cyan-300/70 text-sm flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {artwork.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Testimonials */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            {pendingTestimonials.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Pending Approval ({pendingTestimonials.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pendingTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="bg-[#0c1e35]/50 border border-cyan-500/30 p-5 rounded-xl hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-cyan-100">{t.name}</h4>
                          <p className="text-sm text-cyan-300/70">{t.email}</p>
                        </div>
                        <div className="flex">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-cyan-200 mb-4">"{t.text}"</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveTestimonial(t.id)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold shadow-lg hover:shadow-green-500/30"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold shadow-lg hover:shadow-red-500/30"
                        >
                          <X className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Testimonials */}
            <div className="bg-[#0c1e35]/50 border border-cyan-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-100">
                <MessageSquare className="w-6 h-6 text-green-400" />
                Approved Testimonials (
                {testimonials.filter((t) => t.approved).length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {testimonials
                  .filter((t) => t.approved)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="bg-[#0a1a2e]/50 border border-cyan-500/20 p-5 rounded-xl hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-cyan-100">{t.name}</h4>
                          <p className="text-sm text-cyan-300/70">{t.email}</p>
                        </div>
                        <div className="flex">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-cyan-200 mb-4">"{t.text}"</p>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition font-semibold text-red-400"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminPanel;
