import React, { useState, useEffect } from 'react';
import useAuth from "../../../hooks/useAuth";
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import useFetch from "../../../hooks/useFetch";  
import useUpdate from "../../../hooks/useUpdate";
import { CircularProgress } from '@mui/material';
import baseURL from '../../../shared/baseURL';
import { CheckCircleOutlined, PendingOutlined, CancelOutlined } from '@mui/icons-material';

const InvestmentStatus = ({open, handleClose, investment}) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetch = useFetch();
  const update = useUpdate();
  const url = `${baseURL}investment/status`
  const [isLoading, setIsLoading] = useState(false)

  const { 
    register,
    setValue,
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  useEffect(() => {
    if (investment) {
      Object.entries(investment).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [investment, setValue]);

  const updateStatus = async (status) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login');
      return;
    }
     const formData = new FormData();
     formData.append("status", status);
    try {
      const response = await update(`${url}/${investment._id}`, formData, auth?.accessToken);
        setTimeout(() => {
          toast.success(`Investment Status Updated Successfully`);
          handleClose(); 
        }, 2000);
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message);
    }
  };

  const { mutate } = useMutation(updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('investments');
      setIsLoading(false)
    }
  });

  const handleStatusUpdate = (data) => {
    mutate(data.status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleOutlined className="w-5 h-5 text-green-500" />;
      case 'Pending':
        return <PendingOutlined className="w-5 h-5 text-yellow-500" />;
      case 'Declined':
        return <CancelOutlined className="w-5 h-5 text-red-500" />;
      default:
        return <PendingOutlined className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <ToastContainer />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Investment Status
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Investment Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  ${investment?.amount?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {investment?.investmentPlan?.name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(investment?.status)}
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {investment?.status}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleStatusUpdate)} className="space-y-6">
              <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  New Status
                </label>
                <select
                  id="status"
                  {...register("status", { required: "Please select a status" })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  disabled={investment?.status === "Approved"}
                >
                  <option value="Approved">✅ Approved</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Declined">❌ Declined</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || investment?.status === "Approved"}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} style={{color: 'white'}} />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InvestmentStatus