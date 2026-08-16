import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const SignUpProcess = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <button 
          className='flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium transition-colors duration-200 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-xl dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
          onClick={() => navigate(-1)} 
          type='button'
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text">How to Register</h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Join <span className="font-semibold text-blue-600 dark:text-blue-400">Stock Exchange Mining</span> in just a few simple steps and start your trading journey today.
            </p>
          </div>

          <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl dark:bg-blue-900/30">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Steps</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: '01', title: 'Navigate to Client Portal', desc: 'Desktop: Click "Client Portal" then "Sign Up". Mobile: Use menu bar (top right) → Client Portal → Sign Up', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                { step: '02', title: 'Fill Your Details', desc: 'Enter your name, email, phone, and create a password', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { step: '03', title: 'Start Trading', desc: 'Account created instantly - login and begin your trading journey', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <div className="mb-2 text-xs font-bold text-blue-600 dark:text-blue-400">{item.step}</div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  {index < 2 && (
                    <div className="absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 hidden lg:block transform -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl dark:bg-green-900/30">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What You Need</h2>
              </div>
              <div className="space-y-4">
                {[
                  { icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'Valid email address' },
                  { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', text: 'Phone number for verification' },
                  { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Strong password (8+ characters)' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl dark:bg-blue-900/30">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Important Tips</h2>
              </div>
              <div className="space-y-4">
                {[
                  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Use a secure email you check regularly' },
                  { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', text: 'Keep your login details private' },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Account is created instantly' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">Ready to Get Started?</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Join thousands of traders who trust Stock Exchange Mining for their investment needs.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Register Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpProcess;