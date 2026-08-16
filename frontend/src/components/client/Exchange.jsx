import React from 'react'

const Exchange = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-8 pt-20 px-4 md:px-8'>
      <div className="text-center py-20">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Exchange</h1>
        <p className="text-gray-600 dark:text-gray-400">Trading exchange features coming soon</p>
      </div>
    </div>
  )
}

export default Exchange
