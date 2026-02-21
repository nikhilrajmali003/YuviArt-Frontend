import React from "react";

const About = ({ artworksCount }) => {
  return (
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
                <p className="text-4xl font-bold text-pink-400 mb-2">{artworksCount}+</p>
                <p className="text-gray-300">Artworks Created</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
