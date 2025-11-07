import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FloatingSubmitButton = () => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const navigate = useNavigate();

  // Change position randomly every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 80) + 10; // 10%–90%
      const randomLeft = Math.floor(Math.random() * 80) + 10;
      setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () =>{
    navigate('/signin');
  }

  

  return (
    <motion.button
        onClick={handleClick}
      className="fixed z-50 px-5 py-3 bg-yellow-600 cursor-pointer text-white font-semibold rounded-full shadow-lg"
      animate={{
        top: position.top,
        left: position.left,
        transition: { duration: 2, ease: "easeInOut" },
      }}
      style={{
        position: "fixed",
        transform: "translate(-50%, -50%)",
      }}
    >
      Submit Manuscript
    </motion.button>
  );
};

export default FloatingSubmitButton;
