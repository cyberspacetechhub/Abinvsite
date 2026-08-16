import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "../../utils/Swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useFetch from '../../../hooks/useFetch';
import { useQuery } from 'react-query';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUpOutlined, AccessTimeOutlined, CategoryOutlined, SourceOutlined } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const Blog = () => {
  const fetch = useFetch();
  const url = `${baseURL}crypto-news`
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    const result = await fetch(`${url}`);
    return result.data;
  };

  const { data, isError, isLoading, isSuccess } = useQuery(
    ["cryptoNews"],
     fetchBlogs,
    { keepPreviousData: true,
        staleTime: 10000,
        refetchOnMount:"always",
        onSuccess: () => {
          setTimeout(() => {
          }, 2000)
        }
    }
  );

  return (
    <section className='bg-gray-50 dark:bg-gray-900 pt-20 pb-16 px-4 md:px-12'>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6'>
            Latest Market <span className="text-gradient">Insights</span>
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed'>
            Stay ahead of the financial curve with real-time updates from the world of cryptocurrency and forex. 
            Our curated news feed brings you top headlines, expert analyses, and breaking stories.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <CircularProgress className="text-blue-600 dark:text-blue-400" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 text-lg">Failed to load market insights</p>
          </div>
        )}

        {/* News Slider */}
        {isSuccess && data && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Swiper
              modules={[Autoplay, Navigation]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              loop={true}
              autoplay={{ delay: 60000, disableOnInteraction: false }}
              spaceBetween={30}
              breakpoints={{
                1200: { slidesPerView: 3 },
                768: { slidesPerView: 2 },
                320: { slidesPerView: 1 },
              }}
              className="news-swiper"
            >
              {data?.map((news, index) => (
                <SwiperSlide key={index}>
                  <Link to="/blog-details" state={{ news }}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-full">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={news.image} 
                          alt={news.headline}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {news.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Headline */}
                        <h2 className='text-xl font-bold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                          {news.headline}
                        </h2>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <AccessTimeOutlined className="w-4 h-4" />
                            <span>{new Date(news.datetime * 1000).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <SourceOutlined className="w-4 h-4" />
                            <span>{news.source}</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <p className='text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed'>
                          {news.summary.slice(0, 150)}...
                        </p>

                        {/* Read More */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className='text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors'>
                            Read more →
                          </span>
                          <TrendingUpOutlined className="text-green-500 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button className="swiper-button-prev !static !w-12 !h-12 !bg-white dark:!bg-gray-800 !border !border-gray-300 dark:!border-gray-600 !rounded-full !shadow-lg hover:!bg-gray-50 dark:hover:!bg-gray-700 !transition-all !duration-200 after:!text-blue-600 dark:after:!text-blue-400 after:!text-lg after:!font-bold"></button>
              <button className="swiper-button-next !static !w-12 !h-12 !bg-white dark:!bg-gray-800 !border !border-gray-300 dark:!border-gray-600 !rounded-full !shadow-lg hover:!bg-gray-50 dark:hover:!bg-gray-700 !transition-all !duration-200 after:!text-blue-600 dark:after:!text-blue-400 after:!text-lg after:!font-bold"></button>
            </div>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Stay Updated with Market Trends
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get real-time market insights and expert analysis delivered to your dashboard
            </p>
            <Link 
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Trading Today
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default Blog