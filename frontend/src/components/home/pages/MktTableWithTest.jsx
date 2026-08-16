import React from 'react'
import { Swiper, SwiperSlide } from "../../utils/Swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Flag1 from '../../../assets/image/flag-01.png'
import Flag2 from '../../../assets/image/flag-02.png'
import Flag3 from '../../../assets/image/flag-03.png'
import Flag4 from '../../../assets/image/flag-04.png'
import testimonies from '../../utils/testimonies'

const MktTableWithTest = () => {
  const data = [
    {
      flag: Flag1,
      pair: "EURUSD",
      bid: "1.09554",
      ask: "1.5472",
      spread: "0.1",
      change: "+0.0023",
      changePercent: "+0.21%"
    },
    {
      flag: Flag2,
      pair: "AUDUSD",
      bid: "0.67017",
      ask: "0.3579",
      spread: "0.2",
      change: "-0.0015",
      changePercent: "-0.22%"
    },
    {
      flag: Flag3,
      pair: "USDJPY",
      bid: "109.792",
      ask: "1.7937",
      spread: "0.0",
      change: "+0.125",
      changePercent: "+0.11%"
    },
    {
      flag: Flag4,
      pair: "USDCAD",
      bid: "1.32900",
      ask: "1.9692",
      spread: "0.3",
      change: "+0.0045",
      changePercent: "+0.34%"
    },
  ];

  return (
    <div className="bg-gradient-to-br from-lightBg via-white to-gray-50 dark:from-darkBg dark:via-midnight dark:to-gray-900 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-coral to-orange-500 bg-clip-text text-transparent mb-4">
            Market Intelligence & Success Stories
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Live trading data and authentic testimonials from our thriving community of successful traders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Market Table */}
          <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                Real-Time Market Data
              </h3>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Pair</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Bid</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Ask</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.flag} alt="flag" className="w-8 h-6 rounded object-cover" />
                          <span className="font-semibold text-gray-900 dark:text-white">{item.pair}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {item.bid}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {item.ask}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.change.startsWith('+') 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {item.changePercent}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Enhanced Testimonials */}
          <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Testimonial Header */}
            <div className="bg-gradient-to-r from-coral to-orange-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Trader Success Stories
              </h3>
            </div>

            {/* Testimonial Content */}
            <div className="p-8">
              <div className="mb-6">
                <div className="text-6xl text-coral opacity-50 font-serif leading-none">"</div>
              </div>
              
              <Swiper
                modules={[Autoplay, Navigation]}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                spaceBetween={30}
                className="testimonial-swiper"
              >
                {testimonies.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="min-h-[200px] flex flex-col justify-between">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
                          {item.testimony}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-r from-coral to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</p>
                          <p className="text-coral text-sm font-medium">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button className="swiper-button-prev !static !w-10 !h-10 !mt-0 bg-coral hover:bg-orange-500 rounded-full !text-white transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="swiper-button-next !static !w-10 !h-10 !mt-0 bg-coral hover:bg-orange-500 rounded-full !text-white transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MktTableWithTest