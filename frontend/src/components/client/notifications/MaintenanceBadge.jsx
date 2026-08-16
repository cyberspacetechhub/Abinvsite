import React from 'react'
import useAuth from '../../../hooks/useAuth';

const MaintenanceBadge = () => {
    const {auth} = useAuth();
  return (
    <div className='w-full mb-4'>
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className='text-lg font-bold text-yellow-800 dark:text-yellow-200'>Maintenance in Progress</h3>
                    <p className='text-yellow-700 dark:text-yellow-300 mt-1'>{auth?.user?.maintenanceAlertMessage}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MaintenanceBadge