import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import CreateWithdrawalMethod from './CreateWithdrawalMethod'
import { Payment, Add, Star } from '@mui/icons-material'

const AdminWithdrawalMethod = () => {
    const fetch = useFetch()
    const auth = useAuth()
    const url = `${baseURL}withdrawalmethod`

    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    

    const fetcWithdrawalMethods = async () => {
        const result = await fetch(url, auth.accessToken);
        // console.log(result)
        return result.data;
      };
    
      const { data, isError, isLoading, isSuccess } = useQuery(
        ["withdrwalmethods"],
         fetcWithdrawalMethods,
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
    <div className='w-full'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdrawal Methods</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage payment methods for withdrawals</p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Payment className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Withdrawal Options</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Configure available withdrawal methods</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn-primary flex items-center gap-2"
        >
          <Add className="w-5 h-5" />
          Create New Method
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-20">
          <CircularProgress />
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">Error fetching data</p>
        </div>
      )}
      
      {/* Withdrawal Methods Grid */}
      {isSuccess && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {data?.withdrawalMethods?.length > 0 ? (
            data.withdrawalMethods.map((method) => {
              const isRecommended = method?.name === "USDT (TRC20)";
              const isBitcoin = method?.name === 'Bitcoin' || method?.name === 'BTC';
              
              return (
                <Link key={method._id} to={`/admin/withdarwalMethod/${method._id}`} className='group'>
                  <div className="card p-6 hover:shadow-lg transition-all duration-300 relative">
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className='absolute top-4 right-4'>
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                          <Star className="w-3 h-3" />
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${
                        isBitcoin 
                          ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        <span className={`text-2xl font-bold ${
                          isBitcoin 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {method.name.slice(0,1)}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {method.name}
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Processing Time:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {method?.name === "USDT (TRC20)" ? 'Instant - 45 min' : '5 - 60 min'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Fee:</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">0%</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Limits:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ${method.minAmount} - ${method.maxAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Payment className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Withdrawal Methods</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first withdrawal method to get started</p>
              <button onClick={handleOpenModal} className="btn-primary">
                Create Method
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal */}
      <CreateWithdrawalMethod
        open={openModal}
        handleClose={handleCloseModal}
      />
    </div>
  )
}

export default AdminWithdrawalMethod
