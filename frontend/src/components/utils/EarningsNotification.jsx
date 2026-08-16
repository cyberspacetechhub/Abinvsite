import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import notificationsData from "./notifications";

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const positions = [
  "bottom-10 left-0",
  "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
];

const EarningsNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState(positions[0]);

  useEffect(() => {
    setNotifications(shuffleArray(notificationsData));
  
    const cycle = () => {
      setVisible(true);
  
      setTimeout(() => {
        setVisible(false);
      }, 1000);
  
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notificationsData.length);
        setPosition(positions[Math.floor(Math.random() * positions.length)]);
        cycle();
      }, 7000);
    };
  
    cycle();
  
    return () => clearTimeout(cycle);
  }, []);  

  if (notifications.length === 0) return null;

  const { title, name, location, amount, message } = notifications[currentIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: visible ? 1 : 0, 
        y: visible ? 0 : 20,
        scale: visible ? 1 : 0.9
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed z-30 ${position} left-3 transform -translate-x-1/2 w-4/5 md:w-80`}
    >
      <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl dark:bg-midnight rounded-2xl dark:border-gray-800">
        {/* Header with gradient */}
        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-white">Live Updates</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
              <span className="text-lg font-bold text-white">₿</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                {title}
              </h4>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-800 dark:text-gray-200">{name}</span> from{" "}
                <span className="text-blue-600 dark:text-blue-400">{location}</span> {message}{" "}
                <span className="font-bold text-green-600 dark:text-green-400">{amount}</span>
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 mt-3 bg-gray-200 rounded-full dark:bg-gray-700">
            <motion.div 
              className="h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ width: "0%" }}
              animate={{ width: visible ? "100%" : "0%" }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EarningsNotification;