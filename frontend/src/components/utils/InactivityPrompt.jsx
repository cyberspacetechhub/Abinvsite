import React from 'react';
import { Link } from 'react-router-dom';

const InactivityPrompt = ({ show, onDismiss }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Need Help Getting Started?
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you don't know how to register or get started with trading, we're here to help!
          </p>
          
          <div className="space-y-3">
            <Link
              to="/signup-process"
              onClick={onDismiss}
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Learn How to Register
            </Link>
            
            <button
              onClick={onDismiss}
              className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              I'm fine, thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactivityPrompt;