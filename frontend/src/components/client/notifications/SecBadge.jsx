import React from 'react'
import useAuth from '../../../hooks/useAuth';

const SecBadge = () => {
    const {auth} = useAuth();
  return (
    <div className='w-full mb-4'>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className='text-lg font-bold text-red-800 dark:text-red-200'>Security Update in Progress</h3>
                    <p className='text-red-700 dark:text-red-300 mt-1'>{auth?.user?.securityAlertMessage}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SecBadge