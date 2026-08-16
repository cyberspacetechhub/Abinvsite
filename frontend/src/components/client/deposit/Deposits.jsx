
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'
import { useQuery } from 'react-query'
import { CircularProgress, Pagination } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Deposits = () => {
  const {auth} = useContext(AuthContext)
  const fetch = useFetch()
  const url = `${baseURL}deposit/user`
  const _id = auth?.user?._id
  const { t } = useTranslation()

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
      setPage(value);
    };
    const fetchTransactions = async () => {
      const result = await fetch(`${url}/${_id}?page=${page}&limit=10`, auth.accessToken);
      // console.log(result)
      return result.data;
    };
  
    const { data, isError, isLoading, isSuccess } = useQuery(
      ["deposits", page],
       fetchTransactions,
      { keepPreviousData: true,
          staleTime: 10000,
          refetchOnMount:"always",
          onSuccess: () => {
            setTimeout(() => {
            }, 2000)
          }
      }
    );
    
  const location = useLocation();
  
  return (
    <div className='min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 md:ml-8'>
      <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <Link to='/user/transactions' className='flex items-center gap-2 mb-6 btn-secondary'>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Transactions
        </Link>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>{t('deposit.depositHistory')}</h1>
          <p className='text-gray-600 dark:text-gray-400'>View all your deposit transactions</p>
        </div>
        
        {/* Filter Tabs */}
        <div className='flex items-center gap-1 p-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit'>
          <Link 
            to='/user/deposits' 
            className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
              location.pathname === '/user/deposits' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t('navigation.deposit')}
          </Link>
          <Link 
            to='/user/withdrawals' 
            className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
              location.pathname === '/user/withdrawals' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t('navigation.withdraw')}
          </Link>
          <Link 
            to='/user/investments' 
            className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
              location.pathname === '/user/investments' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t('navigation.investment')}
          </Link>
        </div>
        
        {isLoading && (
          <div className='flex items-center justify-center py-20'>
            <CircularProgress />
          </div>
        )}
        
        {isError && (
          <div className='py-12 text-center'>
            <p className='text-red-600 dark:text-red-400'>Error loading deposit data</p>
          </div>
        )}
        
        {isSuccess && (
          <div className='space-y-4'>
            {data?.deposits?.length > 0 ? (
              data.deposits.map((deposit, index) => (
                <Link 
                  to={`/user/transaction/${deposit._id}`} 
                  key={index} 
                  className="block p-6 transition-all duration-300 card-elevated hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {deposit?.type}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(deposit?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        +{deposit?.amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A'}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        deposit?.status === "Completed" || deposit?.status === "Approved" 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
                          : deposit?.status === "Declined" 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full dark:bg-gray-700">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <p className="font-medium text-gray-500 dark:text-gray-400">No deposits yet</p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Your deposit history will appear here</p>
              </div>
            )}
          </div>
        )}
        
        {data?.totalPage > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              count={data?.totalPage}
              page={page}
              onChange={handleChange}
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Deposits
