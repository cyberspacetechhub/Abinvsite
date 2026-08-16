import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { motion } from "framer-motion";
import { BarChart, Schedule, TrendingUp, Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import useUpdate from '../../../hooks/useUpdate'

const TradeLog = () => {
  const [rejectingTrade, setRejectingTrade] = useState(null);
  const fetch = useFetch();
  // const axiosPrivate = useAxiosPrivate();
  const url = `${baseURL}trade`;
  const {auth} = useAuth();
  const queryClient = useQueryClient();
  const update = useUpdate()

   const fetchTransactions = async () => {
      const result = await fetch(
        `${url}/pending`, 
        auth.accessToken
      );
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
      if (amount >= 200) {
        return "text-green-500";
      } else if (amount > 4) {
        return "text-yellow-500";
      }else{

        return "text-red-500";
      }
      
    };
    const isDue = (dueDate) => {
      return new Date(dueDate) < new Date();
    };

    const rejectTradeMutation = useMutation(
      async (tradeId) => {
        const response = await update(`${url}/reject/${tradeId}`, {}, auth.accessToken);
        return response.data;
      },
      {
        onSuccess: () => {
          toast.success('Trade rejected successfully');
          queryClient.invalidateQueries(['trades']);
          queryClient.refetchQueries(['trades']);
          setRejectingTrade(null);
        },
        onError: (error) => {
          toast.error(error.response?.data?.error || 'Failed to reject trade');
          setRejectingTrade(null);
        }
      }
    );

    const handleRejectTrade = (tradeId) => {
      setRejectingTrade(tradeId);
      rejectTradeMutation.mutate(tradeId);
    };
  return (
    <div className='w-full'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trade Log</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Monitor all pending trades and their status</p>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="max-w-md p-6 card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Schedule className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Trades</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {data ? data.length.toString().padStart(2, '0') : "00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Trades</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor pending trade executions</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to='/admin/trades/due' className='btn-secondary'>
            Due Trades
          </Link>
          <Link to='/admin/trades/rejected' className='btn-secondary'>
            Rejected Trades
          </Link>
        </div>
      </div>

      {/* Trades Table */}
      <div className="p-6 card">
        {isLoading && (
          <div className="flex items-center justify-center p-20">
            <CircularProgress />
          </div>
        )}
        
        {isError && (
          <div className="py-8 text-center">
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
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((trade) => (
                    <tr key={trade._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4 font-mono text-sm text-gray-900 dark:text-gray-300">
                        {trade._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {new Date(trade.createdAt).toLocaleDateString()}
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          at {new Date(trade.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <motion.span
                          className={`font-semibold ${getTradeColor(trade.amount)}`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trade.amount)}
                        </motion.span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className={isDue(trade.dueDate) ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-300"}>
                          {new Date(trade.dueDate).toLocaleDateString()}
                          <span className="ml-2 text-gray-500 dark:text-gray-400">
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
                      <td className="px-4 py-4">
                        {!trade.processed && (
                          <button
                            onClick={() => handleRejectTrade(trade._id)}
                            disabled={rejectingTrade === trade._id}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50"
                          >
                            {rejectingTrade === trade._id ? (
                              <CircularProgress size={12} />
                            ) : (
                              <Close className="w-3 h-3" />
                            )}
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No pending trades found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TradeLog