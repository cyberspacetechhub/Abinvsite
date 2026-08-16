import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUpOutlined, ShowChartOutlined } from "@mui/icons-material";

const CoinlibWidget = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Function to detect Tailwind dark mode class
    const detectTheme = () => {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    };

    // Set initial theme
    setTheme(detectTheme());

    // Optional: observe changes in theme
    const observer = new MutationObserver(() => {
      setTheme(detectTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const src = `https://widget.coinlib.io/widget?type=full_v2&theme=${theme}&cnt=15&pref_coin_id=1505&graph=yes`;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
              <ShowChartOutlined className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Market <span className="text-gradient">Intelligence</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Live cryptocurrency data, market insights, and trading opportunities updated in real-time for informed decision making
          </p>
        </motion.div>

        {/* Widget Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Widget Header */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUpOutlined className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Top Cryptocurrencies
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Widget Content */}
          <div className="p-6">
            <div className="w-full h-[600px] rounded-xl overflow-hidden">
              <iframe
                src={src}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="auto"
                title="Coinlib Widget - Live Cryptocurrency Prices"
                className="rounded-xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Widget Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data provided by <span className="font-semibold">Coinlib</span> • Updated in real-time
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Market Cap</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>24h Change</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Volume</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Ready to Profit from These Markets?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Transform market data into profitable trades with our advanced AI-powered trading platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200">
                Explore Markets
              </button>
              <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                Begin Profitable Trading
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoinlibWidget;