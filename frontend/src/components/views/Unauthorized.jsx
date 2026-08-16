import React from 'react'
import { Link } from 'react-router-dom'

const UnAuthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center px-8 md:px-12 lg:px-24 py-12 rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="text-center mb-8">
          <img src="/semlogo.png" alt="Stock Exchange Mining" className="h-16 mx-auto mb-6" />
          <div className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text mb-4">
            403
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        
        <Link 
          to='/' 
          className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}

export default UnAuthorized
