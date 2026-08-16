import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

const CountUp = ({ number = 10, label = "Experience", suffix = " Years", icon, color = "blue" }) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  const startCount = () => {
    animate(count, number, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.floor(latest)),
    });
  };

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600", 
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <motion.div
      onViewportEnter={startCount}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        {/* Icon */}
        {icon && (
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${colorClasses[color]} rounded-2xl mb-4`}>
            <div className="text-white text-2xl">
              {icon}
            </div>
          </div>
        )}

        {/* Counter */}
        <div className="mb-4">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            <motion.span className={`bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
              {display}
            </motion.span>
            <span className="text-2xl text-gray-600 dark:text-gray-400 ml-1">
              {suffix}
            </span>
          </h3>
        </div>

        {/* Label */}
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default CountUp;