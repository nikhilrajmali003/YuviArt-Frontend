import React, { useState, useEffect } from "react";
import {
  Package,
  Upload,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  DollarSign,
  Tag,
  Save,
  X,
  Loader,
  AlertCircle,
  BarChart3,
  Users,
  Star,
  Eye,
  LogOut,
} from "lucide-react";

// Get API URL from environment or use default
const getApiUrl = () => {
  try {
    return window.VITE_API_URL || "https://yuvi-backend-jkam.onrender.com/api";
  } catch {
    return "https://yuvi-backend-jkam.onrender.com/api";
  }
};

const API_BASE_URL = getApiUrl();

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [artworks, setArtworks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({ artworks: 0, reviews: 0, approved: 0 });
  const [loading, setLoading] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  // New artwork form
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    price: "",
    category: "paintings",
    imageFile: null,
    imagePreview: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch artworks
      const artworksRes = await fetch(`${API_BASE_URL}/artworks`);
      if (artworksRes.ok) {
        const artworksData = await artworksRes.json();
        setArtworks(artworksData);
      }

      // Fetch ALL testimonials (approved + pending) for admin
      const testimonialsRes = await fetch(`${API_BASE_URL}/testimonials/all`);
      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json();
        setTestimonials(testimonialsData);

        // Calculate stats
        const approvedCount = testimonialsData.filter((t) => t.approved).length;
        setStats({
          artworks: artworksData.length,
          reviews: testimonialsData.length,
          approved: approvedCount,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Approve testimonial
  const handleApproveTestimonial = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testimonials/${id}/approve`,
        {
          method: "PUT",
        },
      );

      if (response.ok) {
        alert("✅ Testimonial approved!");
        fetchData();
      }
    } catch (error) {
      alert("❌ Failed to approve testimonial");
    }
  };

  // Delete testimonial
  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Testimonial deleted!");
        fetchData();
      }
    } catch (error) {
      alert("❌ Failed to delete testimonial");
    }
  };

  // Delete artwork
  const handleDeleteArtwork = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Artwork deleted!");
        fetchData();
      }
    } catch (error) {
      alert("❌ Failed to delete artwork");
    }
  };

  // Update artwork
  const handleUpdateArtwork = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("✅ Artwork updated!");
        setEditingArtwork(null);
        fetchData();
      }
    } catch (error) {
      alert("❌ Failed to update artwork");
    }
  };

  // Upload new artwork
  const handleUploadArtwork = async () => {
    const formData = new FormData();
    formData.append("title", newArtwork.title);
    formData.append("description", newArtwork.description);
    formData.append("price", newArtwork.price);
    formData.append("category", newArtwork.category);

    if (newArtwork.imageFile) {
      formData.append("image", newArtwork.imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/artworks`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Artwork uploaded successfully!");
        setNewArtwork({
          title: "",
          description: "",
          price: "",
          category: "paintings",
          imageFile: null,
          imagePreview: null,
        });
        fetchData();
      }
    } catch (error) {
      alert("❌ Failed to upload artwork");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArtwork({
        ...newArtwork,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-cyan-300">
                  YuviArt Admin
                </h1>
                <p className="text-sm text-cyan-400/60">Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-950/60 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: "dashboard", icon: BarChart3, label: "Dashboard" },
              {
                id: "artworks",
                icon: Package,
                label: `Artworks (${stats.artworks})`,
              },
              { id: "upload", icon: Upload, label: "Upload New" },
              {
                id: "reviews",
                icon: MessageSquare,
                label: `Reviews (${stats.reviews})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-cyan-400 text-cyan-300 bg-cyan-400/10"
                    : "border-transparent text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-6">
                  <Package className="w-12 h-12 text-cyan-400 mb-4" />
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.artworks}
                  </p>
                  <p className="text-cyan-300">Total Artworks</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-6">
                  <MessageSquare className="w-12 h-12 text-purple-400 mb-4" />
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.reviews}
                  </p>
                  <p className="text-purple-300">Total Reviews</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-6">
                  <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.approved}
                  </p>
                  <p className="text-green-300">Approved Reviews</p>
                </div>
              </div>
            )}

            {/* Artworks Tab */}
            {activeTab === "artworks" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cyan-300 mb-6">
                  Manage Artworks
                </h2>
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-slate-900/60 border border-cyan-400/20 rounded-xl p-6"
                  >
                    {editingArtwork?.id === artwork.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingArtwork.title}
                          onChange={(e) =>
                            setEditingArtwork({
                              ...editingArtwork,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                        />
                        <textarea
                          value={editingArtwork.description}
                          onChange={(e) =>
                            setEditingArtwork({
                              ...editingArtwork,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                          rows={3}
                        />
                        <input
                          type="number"
                          value={editingArtwork.price}
                          onChange={(e) =>
                            setEditingArtwork({
                              ...editingArtwork,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdateArtwork(artwork.id, editingArtwork)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingArtwork(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 border border-gray-500/50 rounded-lg text-gray-300"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {artwork.title}
                          </h3>
                          <p className="text-gray-400 mb-2">
                            {artwork.description}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-cyan-300">
                              ₹{artwork.price?.toLocaleString()}
                            </span>
                            <span className="text-purple-300">
                              {artwork.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingArtwork(artwork)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 transition"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtwork(artwork.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900/60 border border-cyan-400/20 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-cyan-300 mb-6">
                    Upload New Artwork
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-cyan-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={newArtwork.title}
                        onChange={(e) =>
                          setNewArtwork({
                            ...newArtwork,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-cyan-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newArtwork.description}
                        onChange={(e) =>
                          setNewArtwork({
                            ...newArtwork,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                        rows={4}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-cyan-300 mb-2">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={newArtwork.price}
                          onChange={(e) =>
                            setNewArtwork({
                              ...newArtwork,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-cyan-300 mb-2">
                          Category
                        </label>
                        <select
                          value={newArtwork.category}
                          onChange={(e) =>
                            setNewArtwork({
                              ...newArtwork,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                        >
                          <option value="paintings">Paintings</option>
                          <option value="sketches">Sketches</option>
                          <option value="portraits">Portraits</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-cyan-300 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-400/30 rounded-lg text-white"
                      />
                      {newArtwork.imagePreview && (
                        <img
                          src={newArtwork.imagePreview}
                          alt="Preview"
                          className="mt-4 w-full max-h-64 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <button
                      onClick={handleUploadArtwork}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                    >
                      <Upload className="w-5 h-5" />
                      Upload Artwork
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cyan-300 mb-6">
                  Manage Reviews
                </h2>
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`bg-slate-900/60 border rounded-xl p-6 ${
                      testimonial.approved
                        ? "border-green-400/30"
                        : "border-yellow-400/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {testimonial.email}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!testimonial.approved && (
                          <button
                            onClick={() =>
                              handleApproveTestimonial(testimonial.id)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 transition"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteTestimonial(testimonial.id)
                          }
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">
                      "{testimonial.text || testimonial.testimonial}"
                    </p>
                    {testimonial.approved && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
