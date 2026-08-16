import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { isError } from 'react-query'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import CreateDeposit from './CreateDeposit'
import { useNavigate } from 'react-router-dom'

const DepositMethods = () => {
    const fetch = useFetch()
    const auth = useAuth()
    const url = `${baseURL}depositmethod`
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    const [methodId, setMethodId] = useState('')

    const fetchDepositMethods = async () => {
        const result = await fetch(url, auth.accessToken);
        // console.log(result)
        return result.data;
      };
    
      const { data, isError, isLoading, isSuccess } = useQuery(
        ["depositmethods"],
         fetchDepositMethods,
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
    <div className='min-h-screen bg-gradient-to-br from-lightBg via-white to-gray-50 dark:from-darkBg dark:via-midnight dark:to-gray-900 pt-20 md:ml-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <button 
          className='inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 mb-6' 
          onClick={() => navigate(-1)} 
          type='button'
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-coral to-orange-500 bg-clip-text text-transparent mb-4'>Deposit Methods</h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>Choose your preferred payment method to fund your trading account securely</p>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <CircularProgress />
          </div>
        )}
        
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">Error fetching payment methods</p>
          </div>
        )}
        
        {isSuccess && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {data?.depositMethods?.length > 0 ? (
              data.depositMethods.map((method) => (
                <div key={method._id} className="relative bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  {/* Recommended Badge */}
                  {(method?.name === "USDT (TRC20)" || method?.name === "USDT (ERC20)" || method?.name === "Usdt (Trc20)" || method?.name === "Usdt (Erc20)") && (
                    <div className='absolute top-4 right-4 z-10'>
                      <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg">
                        ⭐ Recommended
                      </span>
                    </div>
                  )}
                  
                  {/* Header */}
                  <div className={`px-6 py-4 bg-gradient-to-r ${
                    method?.name === 'Bitcoin' || method?.name === 'BTC' 
                      ? 'from-yellow-500 to-orange-500' 
                      : 'from-emerald-500 to-teal-600'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {method.name.slice(0,1)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{method.name}</h3>
                        <p className="text-white/80 text-sm">Secure & Fast</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Processing Time</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{method?.name === "USDT (TRC20)" ? 'Instant - 45 minutes' : '5 - 60 minutes'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Fee</p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-bold">0% - No Fees!</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Deposit Limits</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">${method.minAmount} - ${method.maxAmount.toLocaleString()} USD</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className='w-full bg-gradient-to-r from-coral to-orange-500 hover:from-orange-500 hover:to-coral text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
                      onClick={() => {
                        handleOpenModal()
                        setMethodId(method._id)
                      }}
                    >
                      Deposit with {method?.name}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className='text-gray-500 dark:text-gray-400 font-medium'>No payment methods available</p>
              </div>
            )}
          </div>
        )}
        
        <CreateDeposit
          open={openModal}
          handleClose={handleCloseModal}
          methodId={methodId}
        />
      </div>
    </div>
  )
}

export default DepositMethods
