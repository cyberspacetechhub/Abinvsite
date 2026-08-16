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

const CreateDeposit = ({open, handleClose, methodId}) => {
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}deposit`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const fetch = useFetch()
  const [methodDetails, setMethodDetails] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [canSubmit, setCanSubmit] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  useEffect(() => {
    const fetchDepositDetails = async () => {
      try {
        const response = await fetch(`${baseURL}depositMethod/${methodId}`);
        setMethodDetails(response.data);
      } catch (err) {
        setError("Error fetching method details");
      }
    };
    fetchDepositDetails();
  }, [methodId]);

  // Timer effect
  useEffect(() => {
    if (!open) {
      setTimeRemaining(300);
      setCanSubmit(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setCanSubmit(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  // console.log(methodDetails?.minAmount)

  const createDeposit = async (data) => {
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
      
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
    // console.log(formData)
  };

  const {mutate} = useMutation(createDeposit, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('deposits')
      toast.success('Deposit Successfully')
      setTimeout(() => {
        handleClose();
        navigate('/user')
      }, 3000);
  
    }
  })

  const handleCreateDeposit = (data) => {
  mutate(data);  
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <ToastContainer />
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl dark:bg-gray-800 rounded-2xl dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-800">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Make Deposit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {handleClose()}}
                className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
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
            {/* Timer Notice */}
            {!canSubmit && (
              <div className='p-4 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded-xl'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-amber-100 rounded-full dark:bg-amber-800'>
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='font-semibold text-amber-900 dark:text-amber-100'>Please Wait</h4>
                    <p className='text-sm text-amber-800 dark:text-amber-200'>
                      You can complete your deposit in {formatTime(timeRemaining)}. This ensures secure transaction processing.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Instructions */}
            <div className='p-4 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 rounded-xl'>
              <div className='flex items-start gap-3'>
                <div className='p-2 bg-blue-100 rounded-full dark:bg-blue-800'>
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className='mb-2 font-semibold text-blue-900 dark:text-blue-100'>How to Complete Your Deposit</h4>
                  <ol className='space-y-1 text-sm text-blue-800 dark:text-blue-200'>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full flex items-center justify-center mt-0.5'>1</span>
                      <span>Copy the wallet address provided below</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full flex items-center justify-center mt-0.5'>2</span>
                      <span>Open your crypto wallet and send the exact asset type to the copied address</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full flex items-center justify-center mt-0.5'>3</span>
                      <span>Enter your deposit amount and click "Complete Deposit" to finalize the transaction</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            
            <form 
              onSubmit={handleSubmit(handleCreateDeposit)} 
              method='post'
              className="space-y-6"
            >
            <div className='p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-xl dark:border-gray-600'>
              <h4 className='mb-3 font-semibold text-gray-800 dark:text-white'>Deposit Summary</h4>
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
                <div className="space-y-2">
                  <span className='text-gray-600 dark:text-gray-400'>Wallet Address:</span>
                  <div className='flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600'>
                    <p className="flex-1 font-mono text-sm text-gray-800 break-all dark:text-white">
                      {methodDetails?.value}
                    </p>
                    <button 
                      title='Copy address' 
                      type='button' 
                      className='p-2 text-blue-600 transition-colors rounded-lg dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      onClick={() => {
                        navigator.clipboard.writeText(methodDetails?.value);
                        toast.success("Address copied to clipboard");
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {methodDetails?.description && (
                  <div className="space-y-2">
                    <span className='text-gray-600 dark:text-gray-400'>Information:</span>
                    <p className='p-3 text-sm text-gray-700 border rounded-lg dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'>
                      {methodDetails.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="amount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Amount
                  </label>
                  <input
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="amount"
                    type='number'
                    step="0.01"
                    placeholder="Enter deposit amount"
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
                  <p className="text-sm text-red-500">
                    {errors.amount && <span>{errors.amount.message}</span>}
                  </p>
                </div>

                <div>
                  
                  <input
                    type="hidden"
                    name="depositMethod"
                    id="depositMethod"
                    value={methodId}
                    {...register("depositMethod", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-coral500 focus:border-primary-500  "
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
                    className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-coral500 focus:border-primary-500  "
                    required=""
                  />
                </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {handleClose()}}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !canSubmit}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} style={{color: 'white'}} />
                      Processing...
                    </>
                  ) : !canSubmit ? (
                    `Wait ${formatTime(timeRemaining)}`
                  ) : (
                    'Complete Deposit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateDeposit;