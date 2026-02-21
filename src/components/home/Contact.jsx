import React from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";

const Contact = ({
  contactForm,
  setContactForm,
  contactSubmitting,
  contactSuccess,
  handleContactSubmit,
  ARTIST_EMAIL
}) => {
  return (
    <section id="contact" className="relative py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                Let's discuss your next masterpiece or commission
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: ARTIST_EMAIL, link: `mailto:${ARTIST_EMAIL}` },
                { icon: Phone, label: "Phone", value: "+91 9521367232", link: "tel:9521367232" },
                { icon: MapPin, label: "Location", value: "Rajasthan, India", link: "#" }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{item.label}</p>
                    <p className="font-semibold text-lg">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Commission Type</label>
                <select
                  value={contactForm.artType}
                  onChange={(e) => setContactForm({ ...contactForm, artType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Sketch">Sketch</option>
                  <option value="Painting">Painting</option>
                  <option value="Custom">Custom Art</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Message</label>
                <textarea
                  required
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {contactSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {contactSuccess && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center animate-bounce">
                  ✨ Message sent successfully! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Contact);
