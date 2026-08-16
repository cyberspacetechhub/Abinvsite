import React from 'react'
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';

const PlanUpgradeBadge = () => {
    const {auth} = useAuth();
  return (
    <div className='w-full mb-4'>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className='text-lg font-bold text-green-800 dark:text-green-200'>Plan Upgrade Required</h3>
                    <p className='text-green-700 dark:text-green-300 mt-1'>{auth?.user?.planUpgradeAlertMessage}</p>
                    <div className='mt-3 flex items-center gap-2 text-sm'>
                        <span className='text-green-700 dark:text-green-300'>Current Plan:</span>
                        <span className='font-bold text-green-800 dark:text-green-200 uppercase'>{auth?.user?.plan?.name || 'N/A'}</span>
                        <Link 
                            to='/user/investmentplan' 
                            className='inline-flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors duration-200'
                        >
                            <span>Upgrade Now</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PlanUpgradeBadge