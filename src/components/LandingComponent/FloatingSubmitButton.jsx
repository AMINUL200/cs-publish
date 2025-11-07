import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FloatingSubmitButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signin');
  };

  // Subtle shaking animation
  const subtleShake = {
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      rotate: [0, -1, 1, -1, 1, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 8px 20px rgba(139, 69, 19, 0.4)",
      transition: { duration: 0.2 }
    }
  };

  return (
  <motion.button
  onClick={handleClick}
  className="fixed z-50 px-5 py-3 cursor-pointer font-semibold rounded-full shadow-lg border-2"
  variants={subtleShake}
  animate="shake"
  whileHover="hover"
  whileTap={{ scale: 0.95 }}
  style={{
    position: "fixed",
    bottom: "20px",
    right: "80px",
    background: "linear-gradient(135deg, #8B4513 0%, #1a1a1a 50%, #8B4513 100%)", // Brown-red to black gradient
    color: "#FFD700", // Yellow text
    borderColor: "#FFD700", // Yellow border
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.9)",
    boxShadow: "0 4px 20px rgba(255, 215, 0, 0.3)"
  }}
>
  Submit Manuscript
</motion.button>
  );
};

export default FloatingSubmitButton;