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
import { useTranslation } from 'react-i18next';

const CreateInvestment = ({open, handleClose, planId}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}investment`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const fetch = useFetch()
  const [planDetails, setPlanDetails] = useState(null)
  const [depositMethods, setDepositMethod] = useState([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

 const fetchPlanDetails = async () => {
  const response = await fetch(`${baseURL}investmentplan/${planId}`)
  setPlanDetails(response.data)
 }
 useEffect(() => {
  fetchPlanDetails()
 }, [])

 const fetchDepositMethods = async () => {
  const result = await fetch(`${baseURL}depositMethod`, auth?.accessToken)
  setDepositMethod(result.data)
}
useEffect(() => {
  fetchDepositMethods()
}, [])

const [selectedMethod, setSelectedMethod] = useState("");
const [selectedAddress, setSelectedAddress] = useState("");
const [minAmount, setMinAmount] = useState(null);
const [maxAmount, setMaxAmount] = useState(null);
const [description, setDescription] = useState("");

const handleMethodChange = (event) => {
  const methodId = event.target.value;
  setSelectedMethod(methodId);

  const methodDetails = depositMethods?.depositMethods?.find(
    (method) => method._id === methodId
  );

  console.log(methodDetails)
  if (methodDetails) {
    setSelectedAddress(methodDetails.value || "");
    setMinAmount(methodDetails.minAmount || null);
    setMaxAmount(methodDetails.maxAmount || null);
    setDescription(methodDetails.description || "");
  }
};

  const makeInvestment = async (data) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login')
      return;
    }
    const formData = new FormData();
  
  for ( const key in data) {
    formData.append(key, data[key]);
  }

    try{
      const response = await post(url, formData, auth?.accessToken);
      
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
  };

  const {mutate} = useMutation(makeInvestment, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('transactions')
      toast.success('Investment Successfully Created')
      setTimeout(() => {
        handleClose();
        navigate('/user')
      }, 3000);
  
    }
  })

  const handleCreateInvestment = (data) => {
  mutate(data);  
};

  return (
    <Modal
      open={open}
      onClose={() => {handleClose()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <ToastContainer />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-800">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Make Investment
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
            {/* Instructions */}
            <div className='p-4 border bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 rounded-xl'>
              <div className='flex items-start gap-3'>
                <div className='p-2 rounded-full bg-emerald-100 dark:bg-emerald-800'>
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className='mb-2 font-semibold text-emerald-900 dark:text-emerald-100'>How to Complete Your Investment</h4>
                  <ol className='space-y-1 text-sm text-emerald-800 dark:text-emerald-200'>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-emerald-600 rounded-full flex items-center justify-center mt-0.5'>1</span>
                      <span>Select your preferred deposit method from the dropdown menu</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-emerald-600 rounded-full flex items-center justify-center mt-0.5'>2</span>
                      <span>Copy the wallet address and send your investment amount to it</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-emerald-600 rounded-full flex items-center justify-center mt-0.5'>3</span>
                      <span>Enter your investment amount and click "Complete Investment" to start earning</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            
            <form 
              onSubmit={handleSubmit(handleCreateInvestment)} 
              method='post'
              className="space-y-6"
            >
              {/* Plan Summary */}
              <div className='p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-xl dark:border-gray-600'>
                <h4 className='mb-3 font-semibold text-gray-800 dark:text-white'>Investment Plan</h4>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Plan:</span>
                    <span className='font-medium text-gray-800 dark:text-white'>{planDetails?.name}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Limits:</span>
                    <span className='font-medium text-gray-800 dark:text-white'>
                      ${planDetails?.minAmount?.toLocaleString()} - ${planDetails?.maxAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deposit Method */}
              <div>
                <label
                  htmlFor="depositMethod"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Deposit Method
                </label>
                <select
                  id="depositMethod"
                  name='depositMethod'
                  {...register("depositMethod", { required: "Please select a deposit method", onChange:handleMethodChange })}
                  className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  defaultValue={selectedMethod}
                >
                  <option value="" disabled>
                    Select a deposit method
                  </option>
                  {depositMethods?.depositMethods?.map((method) => (
                    <option key={method._id} value={method._id}>
                      {method.name}
                    </option>
                  ))}
                </select>
                {errors.depositMethod && (
                  <p className="mt-1 text-sm text-red-500">{errors.depositMethod.message}</p>
                )}
              </div>

              {/* Selected Address */}
              {selectedAddress && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Wallet Address</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">
                    <p className="flex-1 font-mono text-sm text-gray-800 break-all dark:text-white">
                      {selectedAddress}
                    </p>
                    <button 
                      type='button' 
                      className="p-2 transition-colors duration-200 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      title="Copy address"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAddress);
                        toast.success("Address copied to clipboard");
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Limits */}
                  {(minAmount || maxAmount) && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      Deposit limits: ${minAmount?.toLocaleString()} - ${maxAmount?.toLocaleString()}
                    </div>
                  )}
                  
                  {/* Description */}
                  {description && (
                    <div className="p-3 mt-3 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-700 dark:text-amber-300">{description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Investment Amount
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  id="amount"
                  type='number'
                  step="0.01"
                  placeholder="Enter investment amount"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: planDetails?.minAmount,
                      message: `Minimum amount is $${planDetails?.minAmount}`,
                    },
                    max: {
                      value: planDetails?.maxAmount,
                      message: `Maximum amount is $${planDetails?.maxAmount}`,
                    },
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              {/* Hidden Fields */}
              <input
                type="hidden"
                name="investmentPlan"
                id="investmentPlan"
                value={planId}
                {...register("investmentPlan", { required: true })}
              />
              <input
                type="hidden"
                name="user"
                id="user"
                value={auth?.user?._id}
                {...register("user", { required: true })}
              />
              
              {/* Buttons */}
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
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} style={{color: 'white'}} />
                      Processing...
                    </>
                  ) : (
                    'Complete Investment'
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

export default CreateInvestment;