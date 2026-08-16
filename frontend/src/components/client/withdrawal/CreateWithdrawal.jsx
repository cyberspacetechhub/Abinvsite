import React, { useState, useEffect } from 'react'
import usePost from "../../../hooks/usePost";
import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import WithdrawalVerification from './WithdrawalVerification';
import { useTranslation } from 'react-i18next';

const CreateWithdrawal = ({open, handleClose, methodId}) => {
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}withdrawal`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const fetch = useFetch()
  const [methodDetails, setMethodDetails] = useState(null)
  const [showVerification, setShowVerification] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  useEffect(() => {
    const fetchDepositDetails = async () => {
      try {
        const response = await fetch(`${baseURL}withdrawalmethod/${methodId}`);
        // console.log(response.data)
        setMethodDetails(response.data);
      } catch (err) {
        setError("Error fetching method details");
      }
    };
    fetchDepositDetails();
  }, [methodId]);
  // console.log(methodDetails?.minAmount)

  const createWithdrawal = async (data) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login')
      return;
    }
    const formData = new FormData();
  
  // Append form fields
  for ( const key in data) {
    formData.append(key, data[key]);
  }

  // Log the FormData contents
  for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
  }
    try{
      const response = await post(url, formData, auth?.accessToken);
      // console.log(response.data);
      
      toast.success('Withdrawal Initiated')
    } catch (err) {
      setIsLoading(false)
      // console.log(err)
      toast.error(err.response?.data?.error || err.message)
      setError(err.response?.data?.error || err.message)
    }
    // console.log(formData)
  };

  const {mutate} = useMutation(createWithdrawal, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('transactions')
      setTimeout(() => {
        handleClose();
        navigate('/user')
      }, 3000);
  
    }
  })

  const handleCreateWithdrawal = (data) => {
    if (!isVerified) {
      setShowVerification(true);
      return;
    }
    mutate(data);  
  };
  
  const handleVerificationSuccess = () => {
    setIsVerified(true);
    setShowVerification(false);
  };
  // console.log(auth)
  return (
    <Modal
      open={open}
      onClose={() => {handleClose()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <!-- Main modal --> */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <ToastContainer />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('withdrawal.createWithdrawal')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {handleClose()}}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Instructions */}
            <div className='p-4 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-xl'>
              <div className='flex items-start gap-3'>
                <div className='p-2 bg-red-100 rounded-full dark:bg-red-800'>
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className='mb-2 font-semibold text-red-900 dark:text-red-100'>How to Complete Your Withdrawal</h4>
                  <ol className='space-y-1 text-sm text-red-800 dark:text-red-200'>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center mt-0.5'>1</span>
                      <span>Enter your withdrawal amount within the specified limits</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center mt-0.5'>2</span>
                      <span>Provide your wallet address where you want to receive the funds</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center mt-0.5'>3</span>
                      <span>Click "Complete Withdrawal" to submit your request for processing</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            
            <form 
              onSubmit={handleSubmit(handleCreateWithdrawal)} 
              method='post'
              className="space-y-6"
            >
            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600'>
              <h4 className='font-semibold text-gray-800 dark:text-white mb-3'>Withdrawal Summary</h4>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Method:</span>
                  <span className='font-medium text-gray-800 dark:text-white'>{methodDetails?.name}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Limits:</span>
                  <span className='font-medium text-gray-800 dark:text-white'>
                    {methodDetails?.minAmount?.toLocaleString('en-Us', { style: 'currency', currency: 'USD' })} - {methodDetails?.maxAmount?.toLocaleString('en-Us', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
                {methodDetails?.description && (
                  <div className="space-y-2">
                    <span className='text-gray-600 dark:text-gray-400'>Information:</span>
                    <p className='text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800'>
                      {methodDetails.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
                <div className="sm:col-span-2">
                  <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {t('withdrawal.amount')}
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    id="amount"
                    type='number'
                    step="0.01"
                    placeholder="Enter withdrawal amount"
                    {...register("amount", {
                      required: "Amount is required",
                      min: {
                        value: methodDetails?.minAmount,
                        message: `Minimum amount is ${methodDetails?.minAmount}`,
                      },
                      max: {
                        value: methodDetails?.maxAmount,
                        message: `Maximum amount is ${methodDetails?.maxAmount}`,
                      },
                    })}
                  />
                  <p className="text-red-500 text-sm">
                    {errors.amount && <span>{errors.amount.message}</span>}
                  </p>
                </div>

                <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {t('withdrawal.address')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter your wallet address"
                    {...register("address", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required=""
                  />
                  <p className="text-red-500 text-sm">
                    {errors.address && <span>Address is required</span>}
                  </p>
                </div>

                <div>
                  
                  <input
                    type="hidden"
                    name="withdrawalMethod"
                    id="withdrawalMethod"
                    value={methodId}
                    {...register("withdrawalMethod", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500 "
                    required=""
                  />
                </div>
                <div>
                  
                  <input
                    type="hidden"
                    name="user"
                    id="user"
                    value={auth?.user?._id}
                    {...register("user", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500 "
                    required=""
                  />
                </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {handleClose()}}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} style={{color: 'white'}} />
                      Processing...
                    </>
                  ) : (
                    t('withdrawal.createWithdrawal')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Verification Modal */}
        {showVerification && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <WithdrawalVerification
              onVerified={handleVerificationSuccess}
              onCancel={() => setShowVerification(false)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateWithdrawal;