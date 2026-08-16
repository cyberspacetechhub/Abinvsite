import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
// import { isError } from 'react-query'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import CreateWithdrawal from './CreateWithdrawal'
import { useNavigate } from 'react-router-dom'

const WithdrawalMethods = () => {
    const fetch = useFetch()
    const auth = useAuth()
    const url = `${baseURL}withdrawalmethod`
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    const [method, setMethod] = useState('')

    const fetchWithdrawalMethods = async () => {
        const result = await fetch(url, auth.accessToken);
        // console.log(result)
        return result.data;
      };
    
      const { data, isError, isLoading, isSuccess } = useQuery(
        ["withdrawalMethods"],
         fetchWithdrawalMethods,
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
    <div className='min-h-screen pt-20 bg-gradient-to-br from-lightBg via-white to-gray-50 dark:from-darkBg dark:via-midnight dark:to-gray-900 md:ml-8'>
      <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <button 
          className='inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 transition-colors duration-200 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-xl dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
          onClick={() => navigate(-1)} 
          type='button'
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-coral to-orange-500 bg-clip-text'>Withdrawal Methods</h1>
          <p className='max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300'>Choose your preferred method to withdraw your trading profits securely</p>
        </div>
        {isLoading &&
            <div class="flex items-center justify-center">
                <CircularProgress />
            </div>
        }
        {isError && <p>Error Fetching data</p> }
        {isSuccess &&
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {
                    data?.withdrawalMethods?.length > 0 ? (
                        data.withdrawalMethods.map((method) =>
                            <div key={method._id} className="relative overflow-hidden transition-all duration-300 transform bg-white border border-gray-100 shadow-2xl dark:bg-midnight rounded-2xl dark:border-gray-800 hover:shadow-3xl hover:scale-105">
                              {/* Recommended Badge */}
                              {method?.name === "USDT (TRC20)" && (
                                <div className='absolute z-10 top-4 right-4'>
                                  <span className="px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-green-600">
                                    ⭐ Recommended
                                  </span>
                                </div>
                              )}
                              
                              {/* Header */}
                              <div className={`px-6 py-4 bg-gradient-to-r ${
                                method?.name === 'Bitcoin' || method?.name === 'BTC' 
                                  ? 'from-yellow-500 to-orange-500' 
                                  : 'from-teal-500 to-cyan-600'
                              }`}>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                                    <span className="text-2xl font-bold text-white">
                                      {method.name.slice(0,1)}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-white">{method.name}</h3>
                                    <p className="text-sm text-white/80">Fast & Secure</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-6">
                                <div className="mb-6 space-y-4">
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Processing Time</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">{method?.name === "USDT (TRC20)" ? 'Instant - 45 minutes' : '5 - 60 minutes'}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg dark:bg-green-900/30">
                                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Fee</p>
                                      <p className="text-xs font-bold text-green-600 dark:text-green-400">0% - No Fees!</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg dark:bg-purple-900/30">
                                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Withdrawal Limits</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">${method.minAmount} - ${method.maxAmount.toLocaleString()} USD</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  className='w-full px-6 py-3 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-cyan-600 hover:to-teal-500 rounded-xl hover:scale-105 hover:shadow-xl'
                                  onClick={() => {
                                    handleOpenModal()
                                    setMethod(method._id)
                                  }}
                                >
                                  Withdraw via {method?.name}
                                </button>
                              </div>
                            </div>
                        )
                    ) : (
                        <div className="col-span-2 py-12 text-center">
                          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full dark:bg-gray-700">
                            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <p className='font-medium text-gray-500 dark:text-gray-400'>No withdrawal methods available</p>
                        </div>
                    )
                }
            </div>
        }
            </div>
        
        <CreateWithdrawal
          open={openModal}
          handleClose={handleCloseModal}
          methodId={method}
        />
      </div>
  )
}

export default WithdrawalMethods
