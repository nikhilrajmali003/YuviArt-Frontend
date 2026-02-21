import React, { useState, useEffect } from "react";

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-rose-900/40" />
      
      {/* Subtle Background Photo Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay grayscale"
        style={{
          backgroundImage: 'url("/images/yuviart.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Interactive Glow */}
      <div
        className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-40"
        style={{
          left: `${mousePosition.x - 250}px`,
          top: `${mousePosition.y - 250}px`,
          transition: "transform 0.2s ease-out",
        }}
      />
      
      {/* Secondary Glow */}
      <div
        className="absolute w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px] opacity-30"
        style={{
          left: `${mousePosition.x * 0.8 - 150}px`,
          top: `${mousePosition.y * 0.8 - 150}px`,
          transition: "transform 0.4s ease-out",
        }}
      />
    </div>
  );
};

export default React.memo(AnimatedBackground);
