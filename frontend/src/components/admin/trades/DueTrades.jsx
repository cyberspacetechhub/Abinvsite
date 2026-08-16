import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { useQuery } from 'react-query';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { motion } from "framer-motion";
import { BarChart, TrendingUp, PlayArrow } from '@mui/icons-material';
import useUpdate from '../../../hooks/useUpdate';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';

const DueTrades = () => {

  const fetch = useFetch();
  const url = `${baseURL}trade/due_trade`;
  const {auth} = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 
  const update = useUpdate();
  const [loading, setLoading] = useState(false)

   const fetchTransactions = async () => {
      const result = await fetch(
        `${url}`, 
        auth.accessToken
      );
      // console.log(result)
      return result.data;
    };
  
    const { data, isError, isLoading, isSuccess } = useQuery(
      ["trades"],
       fetchTransactions,
      { keepPreviousData: true,
          staleTime: 10000,
          refetchOnMount:"always",
          onSuccess: () => {
            setTimeout(() => {
            }, 2000)
          }
      }
    );
    const getTradeColor = (amount) => {
      if (amount > 4) return "text-green-500";
      if (amount > 2) return "text-yellow-500";
      return "text-red-500";
    };
    const isDue = (dueDate) => {
      return new Date(dueDate) < new Date();
    };

    const processTrades = async () => {
        setLoading(true)
        if (!auth || !auth?.accessToken) {
          navigate('/auth/admin/login');
          return;
        }
        try {
          const response = await update(`${baseURL}trade`, {}, auth?.accessToken);
          setLoading(false)
          return response.data
        } catch (error) {
          setLoading(false)
          throw error
        }
      };
    
      const { mutate } = useMutation(processTrades, {
        onSuccess: (response) => {
          queryClient.invalidateQueries('trades');
          toast.success(response?.result?.message || 'Trades processed successfully');
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.error || error.message || 'Failed to process trades';
          toast.error(errorMessage);
        }
      });
      
      const handleProcessTrades = () => {
        if (window.confirm("Are you sure you want to process all due trades?")) {
          mutate();
        }
      };
      
  return (
    <div className='w-full'>
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Due Trades Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and process trades that are due for completion</p>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="card p-6 max-w-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BarChart className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Due Trades</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data ? data.length.toString().padStart(2, '0') : "00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Due Trades</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Trades ready for processing</p>
          </div>
        </div>
        <Link to='/admin/trades' className='btn-secondary'>
          View Pending Trades
        </Link>
      </div>

      {/* Trades Table */}
      <div className="card p-6">
        {isLoading && (
          <div className="flex items-center justify-center p-20">
            <CircularProgress />
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error fetching data</p>
          </div>
        )}
        
        {isSuccess && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Trade Start</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Profit Amount</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Due Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((trade) => (
                    <tr key={trade._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300 font-mono">
                        {trade._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {new Date(trade.createdAt).toLocaleDateString()}
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          at {new Date(trade.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <motion.span
                          className={`font-semibold ${getTradeColor(trade.amount)}`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ${trade.amount?.toLocaleString()}
                        </motion.span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className={isDue(trade.dueDate) ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-300"}>
                          {new Date(trade.dueDate).toLocaleDateString()}
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            by {new Date(trade.dueDate).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          trade?.processed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {trade.processed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No due trades found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Trades Button */}
      {data?.length > 0 && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleProcessTrades} 
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayArrow className="w-5 h-5" />
            {loading ? 'Processing...' : 'Process All Trades'}
          </button>
        </div>
      )}
    </div>
  )
}

export default DueTrades