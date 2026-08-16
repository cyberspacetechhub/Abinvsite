import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleOutlined, TrendingUpOutlined, NotificationsActiveOutlined } from "@mui/icons-material";

const plans = [
  { 
    name: "Basic Plan", 
    price: "$200", 
    roi: "20%", 
    duration: "30 Days",
    alerts: "Trading alerts",
    features: ["24/7 Support", "Basic Analytics", "Mobile App Access"],
    popular: false,
    gradient: "from-blue-500 to-blue-600"
  },
  { 
    name: "Silver Plan", 
    price: "$30,000", 
    roi: "30%", 
    duration: "60 Days",
    alerts: "Advanced alerts",
    features: ["Priority Support", "Advanced Analytics", "API Access", "Risk Management"],
    popular: false,
    gradient: "from-gray-400 to-gray-500"
  },
  { 
    name: "Gold Plan", 
    price: "$50,000", 
    roi: "50%", 
    duration: "90 Days",
    alerts: "Premium alerts",
    features: ["VIP Support", "Premium Analytics", "Custom Strategies", "Portfolio Management"],
    popular: true,
    gradient: "from-yellow-400 to-yellow-500"
  },
  { 
    name: "Premium Plan", 
    price: "$100,000", 
    roi: "80%", 
    duration: "120 Days",
    alerts: "Elite alerts",
    features: ["Dedicated Manager", "Elite Analytics", "Custom Solutions", "White-label Access"],
    popular: false,
    gradient: "from-purple-500 to-purple-600"
  },
];

export default function InvestmentPlans() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 pt-20 pb-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Trading <span className="text-gradient">Strategies</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Select your path to financial freedom with our expertly designed trading strategies tailored for every investor
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-r ${plan.gradient} text-white text-center py-6`}>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold">{plan.price}</div>
                <p className="text-sm opacity-90 mt-1">Minimum Investment</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* ROI Display */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUpOutlined className="text-green-500" />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {plan.roi}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expected ROI</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{plan.duration}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-center gap-3">
                      <CheckCircleOutlined className="text-green-500 w-5 h-5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-3">
                    <NotificationsActiveOutlined className="text-blue-500 w-5 h-5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{plan.alerts}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link 
                  to="/register"
                  className={`block w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-200 transform hover:scale-105 shadow-lg`}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Ready for Elite Trading?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect with our trading experts for exclusive strategies and personalized portfolio management
            </p>
            <Link 
              to="/support"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get VIP Access
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}