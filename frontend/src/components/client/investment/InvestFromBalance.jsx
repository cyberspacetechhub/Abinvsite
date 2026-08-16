import React, { useState, useEffect } from "react";
import usePost from "../../../hooks/usePost";
import useAuth from "../../../hooks/useAuth";
import baseURL from "../../../shared/baseURL";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import useFetch from "../../../hooks/useFetch";


const InvestFromBalance = ({ open, handleClose, planId }) => {
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}investment/invest-from-balance`; // API Endpoint for invest from balance
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const fetch = useFetch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  // Fetch investment plan details
  useEffect(() => {
    if (!planId) return;
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch(`${baseURL}investmentplan/${planId}`);
        setPlanDetails(response.data);
      } catch (error) {
        // console.error("Error fetching plan details:", error);
      }
    };
    fetchPlanDetails();
  }, [planId]);

  // Ensure validation only applies when minAmount and maxAmount exist
  const makeInvestmentFromBalance = async (data) => {
    setIsLoading(true);
    if (!auth?.accessToken) {
      navigate("/login");
      return;
    }

    const formData = {
      amount: data.amount,
      user: auth?.user?._id,
      investmentPlan: planId,
    };

    try {
      await post(url, formData, auth?.accessToken);
      toast.success("Investment successfully made from balance!");
      setTimeout(() => {
        handleClose();
        navigate("/user");
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" className="flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
        <ToastContainer />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invest from Balance</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(makeInvestmentFromBalance)} method="post" className="space-y-6">
            <div>
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Investment Amount
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter investment amount"
                {...register("amount", {
                  required: "Amount is required",
                  min: planDetails?.minAmount
                    ? { value: planDetails.minAmount, message: `Minimum amount is ${planDetails.minAmount}` }
                    : undefined,
                  max: planDetails?.maxAmount
                    ? { value: planDetails.maxAmount, message: `Maximum amount is ${planDetails.maxAmount}` }
                    : undefined,
                })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

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
                    <CircularProgress size={16} style={{ color: "white" }} />
                    Processing...
                  </>
                ) : (
                  'Confirm Investment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default InvestFromBalance;
