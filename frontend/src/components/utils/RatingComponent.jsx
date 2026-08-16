import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Star } from "@mui/icons-material";

const RatingComponent = ({ rating, totalRatings }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: true, margin: "-50px" });

  const ratingControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      ratingControls.start({ 
        value: rating, 
        transition: { duration: 1, ease: "easeOut" } 
      });

      let interval = setInterval(() => {
        setCount((prev) =>
          prev < totalRatings ? prev + Math.ceil(totalRatings / 100) : totalRatings
        );
      }, 10);

      return () => clearInterval(interval);
    }
  }, [isInView, ratingControls, totalRatings, rating]);

  const starCounts = [
    { stars: 5, count: Math.round(totalRatings * 0.65) },
    { stars: 4, count: Math.round(totalRatings * 0.2) },
    { stars: 3, count: Math.round(totalRatings * 0.08) },
    { stars: 2, count: Math.round(totalRatings * 0.04) },
    { stars: 1, count: Math.round(totalRatings * 0.03) },
  ];

  const [localRating, setLocalRating] = useState(null);

  return (
    <div className="overflow-hidden border border-gray-100 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-midnight dark:via-gray-900 dark:to-midnight rounded-3xl dark:border-gray-800">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-center text-white">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Trader Reviews & Success
        </h1>
      </div>

      <div className="p-8">
        <motion.div ref={ref} className="space-y-8">
          {/* Overall Rating Section */}
          <div className="p-8 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <div className="flex flex-col items-center gap-6">
              {/* Large Rating Number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <motion.span
                  className="font-bold text-transparent text-8xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text"
                  animate={ratingControls}
                >
                  {Math.round((localRating
                    ? (rating * totalRatings + localRating) / (totalRatings + 20)
                    : rating) * 10) / 10}
                </motion.span>
              </motion.div>

              {/* Stars */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.span
                      key={star}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={isInView ? { scale: 1, rotate: 0 } : {}}
                      transition={{ duration: 0.5, delay: star * 0.1 }}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= Math.floor(rating)
                            ? "text-yellow-400 fill-current"
                            : star === Math.ceil(rating) && rating % 1 > 0
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300 fill-current"
                        }`}
                      />
                    </motion.span>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {count?.toLocaleString()}
                  </span>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Total Ratings</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="p-6 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Rating Breakdown</h3>
            <div className="space-y-4">
              {starCounts.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-4">
                  <div className="flex items-center w-16 gap-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stars}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="flex-1 h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={isInView ? { width: `${(count / totalRatings) * 100}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    />
                  </div>
                  
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="w-16 text-sm font-medium text-right text-gray-600 dark:text-gray-400"
                  >
                    {count?.toLocaleString()}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Summary */}
          <div className="p-6 border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl dark:border-gray-600">
            <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              <span className="text-2xl animate-pulse">🚀</span>
              Success Stories
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Traders achieve remarkable results with <span className="px-2 py-1 font-bold text-orange-600 bg-orange-100 rounded dark:bg-orange-900/30">Stock Exchange Mining</span> through our intelligent AI systems, precision trading algorithms, and 24/7 market monitoring. Success highlights include consistent portfolio growth, profitable automated strategies, and secure asset management. Users praise our cutting-edge technology, real-time analytics, and professional-grade trading infrastructure.
            </p>

            {/* Feature Tags */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">Popular Features</h3>
              <div className="flex flex-wrap gap-3">
                {['AI Trading', 'Crypto Bots', 'Forex Signals', 'DeFi Yields', 'Arbitrage'].map((feature) => (
                  <span key={feature} className="px-4 py-2 text-sm font-medium text-white transition-shadow rounded-full shadow-lg bg-gradient-to-r from-orange to-amber-500 hover:shadow-xl">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Rating */}
          <div className="p-6 text-center bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              Share Your Success Story
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer transition-all duration-200 w-10 h-10 ${
                    star <= (localRating ?? 0)
                      ? "text-yellow-400 fill-current scale-110 drop-shadow-lg"
                      : "text-gray-300 fill-current hover:text-yellow-400 hover:scale-105"
                  }`}
                  onClick={() => {
                    setLocalRating(star);
                    const newAvg = (rating * totalRatings + star) / (totalRatings + 20);
                    ratingControls.start({
                      value: newAvg,
                      transition: { duration: 0.5, ease: "easeOut" }
                    });
                  }}
                />
              ))}
            </div>
            {localRating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800"
              >
                <p className="font-medium text-green-700 dark:text-green-400">
                  Thank you for rating us {localRating} star{localRating > 1 ? "s" : ""}! 
                  Your feedback helps us improve.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RatingComponent;