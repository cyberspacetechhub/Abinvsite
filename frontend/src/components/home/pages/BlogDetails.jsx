import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowBackOutlined, AccessTimeOutlined, CategoryOutlined, SourceOutlined, LaunchOutlined } from '@mui/icons-material';

const BlogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const news = location.state?.news;

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ArrowBackOutlined className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center space-x-2 text-sm mb-8'
        >
          <Link to='/' className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors'>
            Home
          </Link>
          <span className='text-gray-400'>/</span>
          <Link to='/#blog' className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors'>
            Market Insights
          </Link>
          <span className='text-gray-400'>/</span>
          <span className='text-gray-600 dark:text-gray-300'>Article Details</span>
        </motion.nav>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-8"
        >
          <ArrowBackOutlined className="w-5 h-5" />
          <span className='font-medium'>Back to Market Insights</span>
        </motion.button>

        {/* Article Content */}
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Featured Image */}
          <div className="relative">
            <img 
              src={news.image} 
              alt={news.headline}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {news.category}
              </span>
            </div>
          </div>

          {/* Article Header */}
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              {news.headline}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <AccessTimeOutlined className="w-5 h-5" />
                <span className="font-medium">{new Date(news.datetime * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <SourceOutlined className="w-5 h-5" />
                <span className="font-medium">{news.source}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border-l-4 border-blue-500 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Summary</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              {/* Source Link */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Read Full Article</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get the complete story and additional insights from the original source.
                </p>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <LaunchOutlined className="w-5 h-5" />
                  Read on {news.source}
                </a>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Articles CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Stay Informed with Market Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get the latest market insights and trading opportunities delivered to your dashboard
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#blog"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                More Articles
              </Link>
              <Link 
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Trading
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetails;