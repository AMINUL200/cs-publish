import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolling down 50px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center 
                     rounded-full bg-[#ffba00] text-white shadow-lg 
                     hover:bg-[#b78703] hover:translate-y-[-3px] 
                     transition-all duration-300 ease-in-out z-50 cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
        </button>
      )}
    </>
  );
};

export default BackToTop;
