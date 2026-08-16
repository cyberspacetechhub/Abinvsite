import React, { useState, useEffect } from 'react'
import useUpdate from '../../../hooks/useUpdate';
import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Close, Edit, TrendingDown } from '@mui/icons-material';

const UpdateWithdrawalMethod = ({open, handleClose, method}) => {
  const queryClient = useQueryClient();
  const update = useUpdate();
  const { auth } = useAuth();
  const url = `${baseURL}withdrawalmethod`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all" });

  useEffect(() => {
    if (method) {
      Object.entries(method).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [method, setValue]);

  const updateMethod = async (data) => {
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

    try{
      const response = await update(url, formData, auth?.accessToken);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
  };

  const {mutate} = useMutation(updateMethod, {
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('withdrawalMethod')
      toast.success('Withdrawal Method Updated Successfully')
    }
  })

  const handleUpdateMethod = (data) => {
    mutate(data);  
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md max-h-[90vh] overflow-hidden">
        <ToastContainer />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Update Withdrawal Method</h3>
              <p className="text-amber-100 text-sm">Modify payment method details</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Close className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(handleUpdateMethod)} className="space-y-6">
            {/* Method Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Method Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                {...register("name", { required: "Method name is required" })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="e.g., Bitcoin, PayPal, Bank Transfer"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                {...register("description", { required: "Description is required" })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 resize-none"
                placeholder="Provide instructions or additional information for users"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Amount Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minAmount" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Min. Amount ($)
                </label>
                <input
                  type="number"
                  name="minAmount"
                  id="minAmount"
                  min="0"
                  step="0.01"
                  {...register("minAmount", { 
                    required: "Minimum amount is required",
                    min: { value: 0, message: "Amount must be positive" }
                  })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  placeholder="0.00"
                />
                {errors.minAmount && <p className="mt-1 text-sm text-red-600">{errors.minAmount.message}</p>}
              </div>

              <div>
                <label htmlFor="maxAmount" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Max. Amount ($)
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  id="maxAmount"
                  min="0"
                  step="0.01"
                  {...register("maxAmount", { 
                    required: "Maximum amount is required",
                    min: { value: 0, message: "Amount must be positive" }
                  })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  placeholder="0.00"
                />
                {errors.maxAmount && <p className="mt-1 text-sm text-red-600">{errors.maxAmount.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <CircularProgress size={20} style={{color: 'white'}} />
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    Update Withdrawal Method
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateWithdrawalMethod;