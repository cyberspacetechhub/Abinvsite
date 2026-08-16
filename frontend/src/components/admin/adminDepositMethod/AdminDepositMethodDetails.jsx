import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CreateDepositMethod from './CreateDepositMethod'
import { CircularProgress } from '@mui/material'
import { isError } from 'react-query'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import { useParams } from 'react-router-dom'
import UpdateDepositMethod from './UpdateDepositMethod'
import DeleteDepositMethod from './DeleteDepositMethod'
import { ArrowBack, AccountBalance, Edit, Delete, AttachMoney, Info } from '@mui/icons-material'

const AdminDepositMethodDetails = () => {
  const fetch = useFetch()
  const auth = useAuth()
  const url = `${baseURL}depositmethod`
  const { id } = useParams()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const [openDelete, setOpenDelete] = useState(false)
  const handleOpenDelete = () => setOpenDelete(true)
  const handleCloseDelete = () => setOpenDelete(false)
  const [method, setMethod] = useState(null)
  const [methodId, setMethodId] = useState(null)

  const fetchDepositMethod = async () => {
      const result = await fetch(`${url}/${id}`, auth.accessToken);
      setMethod(result.data);
      return result.data;
    };
  
    const { data, isError, isLoading, isSuccess } = useQuery(
      ["depositmethod"],
       fetchDepositMethod,
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-darkBg dark:to-midnight p-6'>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/admin/depositmethods" 
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200'
          >
            <ArrowBack className="w-4 h-4" />
            Back to Methods
          </Link>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deposit Method Details</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage deposit method configuration</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-20">
            <div className="text-center">
              <CircularProgress />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading method details...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">Error fetching method details</p>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <AccountBalance className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{method?.name || 'N/A'}</h2>
                  <p className="text-blue-100">Deposit Payment Method</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Method Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Method Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Address</label>
                        <div className="mt-1 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                            {method?.value || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                        <div className="mt-1 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-900 dark:text-white">
                            {method?.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limits Information */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <AttachMoney className="w-5 h-5 text-green-600" />
                      Transaction Limits
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Amount</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${method?.minAmount?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-xl">↓</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maximum Amount</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${method?.maxAmount?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-xl">↑</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 justify-end">
                <button 
                  onClick={() => {
                    handleOpenModal()
                    setMethod(method)
                  }}
                  className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <Edit className="w-4 h-4" />
                  Edit Method
                </button>
                
                <button 
                  onClick={() => {
                    handleOpenDelete()
                    setMethodId(method._id)
                  }}
                  className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <Delete className="w-4 h-4" />
                  Delete Method
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <UpdateDepositMethod
          open={openModal}
          handleClose={handleCloseModal}
          method={method}
        />
        <DeleteDepositMethod
          open={openDelete}
          handleClose={handleCloseDelete}
          methodId={methodId}
          url={url}
        />
      </div>
    </div>
  )
}

export default AdminDepositMethodDetails