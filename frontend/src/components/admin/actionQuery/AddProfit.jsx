import React, { useState } from 'react'
import usePost from "../../../hooks/usePost";
import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { TrendingUp, Close } from '@mui/icons-material';

const AddProfit = ({open, handleClose, userId}) => {
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}trade/profit`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

 
  const addBalance = async (data) => {
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
      const response = await post(`${url}/${userId}`, formData, auth?.accessToken);
      // console.log(response.data);
      return response.data
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
    // console.log(formData)
  };

  const {mutate} = useMutation(addBalance, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('client')
      toast.success('Balance Updated successfull')
      setTimeout(() => {
        handleClose();
      }, 3000);
  
    }
  })

  const handleAddBalance = (data) => {
  mutate(data);  
};
  // console.log(auth)
  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
        <ToastContainer />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Profit Balance
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleAddBalance)} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Profit Amount
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter profit amount (e.g., 100.00)"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" }
              })}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} style={{color: 'white'}} />
                  Processing...
                </>
              ) : (
                'Add Profit'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddProfit;