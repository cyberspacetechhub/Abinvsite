import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import { useParams } from 'react-router-dom'
import CreateDeposit from '../deposit/CreateDeposit'
import { useTranslation } from 'react-i18next'

const DepositMethodDetails = () => {
  const { t } = useTranslation();
  const fetch = useFetch()
  const auth = useAuth()
  const url = `${baseURL}depositmethod`
  const { id } = useParams()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const [method, setMethod] = useState(null)
  const [methodId, setMethodId] = useState(null)
  // const [planId, setPlanId] = useState(null)

  const fetchDepositMethod = async () => {
      const result = await fetch(`${url}/${id}`, auth.accessToken);
      // console.log(result)
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

    const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const value = method?.value || 'N/A';
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
    });
  };
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-8 pt-20 px-4 md:px-8'>
      <div className="mb-8">
        <Link to="/user/depositMethod" className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-6'>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className='font-medium'>{t('deposit.backToMethods')}</span>
        </Link>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-2'>{t('deposit.methodDetails')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('deposit.securePayment')}</p>
      </div>
      {isLoading && (
        <div className='flex items-center justify-center py-20'>
          <CircularProgress className="text-blue-600 dark:text-blue-400" />
        </div>
      )}
      {isError && (
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400 text-lg">Error fetching deposit method details</p>
        </div>
      )}
      {
        isSuccess && 
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{method?.name || 'Payment Method'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secure payment processing</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Wallet Address */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('deposit.walletAddress')}</span>
                {copied && (
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">{t('common.copied')}</span>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="flex-1 text-sm font-mono text-gray-800 dark:text-white break-all">
                  {method?.value || 'N/A'}
                </p>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                  title="Copy address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('deposit.minimumAmount')}</span>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                  ${method?.minAmount?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('deposit.maximumAmount')}</span>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                  ${method?.maxAmount?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
            
            {/* Description */}
            {method?.description && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">{t('deposit.importantInfo')}</h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">{method.description}</p>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center p-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => {
                handleOpenModal()
                setMethodId(method._id)
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('deposit.proceedDeposit')}
            </button>
          </div>
        </div>
      }
      
      <CreateDeposit
        open={openModal}
        handleClose={handleCloseModal}
        methodId={methodId}
      />
    </div>
  )
}

export default DepositMethodDetails
