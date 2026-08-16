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

const CreateInvestmentPlan = ({open, handleClose}) => {
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}investmentplan`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  const createPlan = async (data) => {
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
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
    // console.log(formData)
  };

  const {mutate} = useMutation(createPlan, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('investmentPlans')
      toast.success('New Investment Plan Created Successfully')

  
    }
  })

  const handleCreatePlan = (data) => {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <ToastContainer />
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create Investment Plan
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {handleClose()}}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit(handleCreatePlan)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: true })}
                    className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label htmlFor="interest" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interest"
                    {...register("interest", { required: true })}
                    className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter interest rate"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Duration
                  </label>
                  <select
                    id="duration"
                    {...register("duration", { required: true })}
                    className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="7">One Week (7 days)</option>
                    <option value="10">10 Days</option>
                    <option value="14">Two Weeks (14 days)</option>
                    <option value="30">One Month (30 days)</option>
                  </select>
                  {errors.duration && (
                    <span className="text-red-500 text-sm mt-1">This field is required</span>
                  )}
                </div>

                <div>
                  <label htmlFor="noOfTimes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Trades Per Day
                  </label>
                  <select
                    id="noOfTimes"
                    {...register("noOfTimes", { required: true })}
                    className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="1">1 Trade per day</option>
                    <option value="2">2 Trades per day</option>
                    <option value="3">3 Trades per day</option>
                    <option value="4">4 Trades per day</option>
                  </select>
                  {errors.noOfTimes && (
                    <span className="text-red-500 text-sm mt-1">This field is required</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Minimum Amount ($)
                    </label>
                    <input
                      id="minAmount"
                      type="number"
                      {...register("minAmount", { required: true })}
                      className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Min amount"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Maximum Amount ($)
                    </label>
                    <input
                      id="maxAmount"
                      type="number"
                      {...register("maxAmount", { required: true })}
                      className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Max amount"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <CircularProgress size={20} style={{color: 'white'}} />
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Plan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateInvestmentPlan;