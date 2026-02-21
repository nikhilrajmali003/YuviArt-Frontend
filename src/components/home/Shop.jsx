import React from "react";
import { Palette, Heart, Star, AlertCircle } from "lucide-react";

const Shop = ({
  artworks,
  filteredArtworks,
  selectedCategory,
  setSelectedCategory,
  handleWishlist,
  isInWishlist,
  handleAddToCart,
  addingToCart,
  isInCart,
  user,
  getImageUrl
}) => {
  return (
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

        {artworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-2xl mx-auto">
              <Palette className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-gray-400 text-xl mb-2">No artworks available at the moment.</p>
              <p className="text-gray-500">Check back soon for new collections!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {["all", "sketches", "portraits", "paintings", "custom"].map((cat) => (
                <button
                  key={`shop-filter-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                      : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((art, index) => {
                const imageUrl = getImageUrl(art.imageUrl);
                const isOldPath = art.imageUrl?.startsWith("/api/upload/");

                return (
                  <div
                    key={`shop-item-${art.id}-${index}`}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="relative overflow-hidden bg-slate-900">
                      <img
                        src={imageUrl}
                        alt={art.title}
                        loading="lazy"
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x500?text=Image+Not+Found";
                        }}
                      />

                      {isOldPath && (
                        <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 z-10">
                          <AlertCircle className="w-3 h-3" />
                          Re-upload Required
                        </div>
                      )}

                      <button
                        onClick={() => handleWishlist(art.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isInWishlist(art.id) ? "fill-pink-400 text-pink-400" : "text-white"
                          }`}
                        />
                      </button>

                      <div className="absolute bottom-4 left-4 flex gap-1 z-10">
                        {[...Array(art.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{art.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{art.description}</p>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <span className="text-2xl sm:text-3xl font-bold text-yellow-400">
                          ₹{art.price.toLocaleString("en-IN")}
                        </span>

                        <button
                          onClick={() => handleAddToCart(art)}
                          disabled={addingToCart === art.id || isOldPath}
                          className={`w-full sm:w-auto px-6 py-3 rounded-full font-extrabold transition-all duration-300 ${
                            isOldPath
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : addingToCart === art.id
                              ? "bg-yellow-500 text-black cursor-wait"
                              : isInCart(art.id)
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 hover:bg-yellow-400 text-black"
                          }`}
                        >
                          {isOldPath ? "Unavailable" : addingToCart === art.id ? "Adding..." : isInCart(art.id) ? "✓ In Cart" : user ? "Add to Cart" : "Buy Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(Shop);
