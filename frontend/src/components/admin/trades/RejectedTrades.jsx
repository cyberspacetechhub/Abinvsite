import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { useQuery } from 'react-query';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { motion } from "framer-motion";
import { Close, ArrowBack, TrendingDown } from '@mui/icons-material';

const RejectedTrades = () => {
  const fetch = useFetch();
  const url = `${baseURL}trade`;
  const {auth} = useAuth();

   const fetchRejectedTrades = async () => {
      const result = await fetch(
        `${url}/rejected`, 
        auth.accessToken
      );
      return result.data;
    };
  
    const { data, isError, isLoading, isSuccess } = useQuery(
      ["rejectedTrades"],
       fetchRejectedTrades,
      { keepPreviousData: true,
          staleTime: 10000,
          refetchOnMount:"always"
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

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to='/admin/trades' className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rejected Trades</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">View all manually rejected trades</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="max-w-md p-6 card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <Close className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rejected Trades</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {data ? data.length.toString().padStart(2, '0') : "00"}
              </p>
            </div>
          </div>
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
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Loss Amount</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Rejected Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
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
                          className="font-semibold text-red-600 dark:text-red-400"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trade.amount)}
                        </motion.span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {new Date(trade.processedAt).toLocaleDateString()}
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          at {new Date(trade.processedAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <TrendingDown className="w-3 h-3" />
                          Rejected
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No rejected trades found
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

export default RejectedTrades