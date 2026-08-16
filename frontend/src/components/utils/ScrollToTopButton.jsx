import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
        title="to-top"
      onClick={scrollToTop}
      className={`fixed bottom-24 right-5 w-12 h-12 z-30 rounded-full bg-blue-600 text-white shadow-lg transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      ⬆
    </button>
  );
};

export default ScrollToTopButton;
