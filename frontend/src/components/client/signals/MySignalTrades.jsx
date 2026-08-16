import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Schedule, CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';

const MySignalTrades = () => {
  const { auth } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTrades = async () => {
    try {
      const response = await axios.get(`${baseURL}signal/my-trades`, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      setTrades(response.data.trades);
    } catch (error) {
      toast.error('Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTrades();
  }, []);

  const getStatusIcon = (status, result) => {
    if (status === 'active') return <Schedule className="w-5 h-5 text-yellow-500" />;
    if (result === 'gain') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (result === 'loss') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <CheckCircle className="w-5 h-5 text-gray-500" />;
  };

  const getStatusColor = (status, result) => {
    if (status === 'active') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (result === 'gain') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (result === 'loss') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 md:ml-8">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/user" className="flex items-center gap-2 btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Signal Trades</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your signal trading performance</p>
          </div>
        </div>

        {trades.length === 0 ? (
          <div className="p-12 text-center card-elevated">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Signal Trades</h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">You haven't joined any signals yet</p>
            <Link to="/user/signals" className="btn-primary">
              Browse Active Signals
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {trades.map((trade) => (
              <div key={trade._id} className="p-6 card-elevated">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(trade.status, trade.result)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {trade.signalId.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trade.status, trade.result)}`}>
                        {trade.status === 'active' ? 'ACTIVE' : trade.result?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Asset:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{trade.signalId.asset}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Entry Amount:</span>
                        <p className="font-medium text-gray-900 dark:text-white">${trade.entryAmount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Expected Return:</span>
                        <p className="font-medium text-green-600 dark:text-green-400">${trade.expectedReturn.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Actual Return:</span>
                        <p className={`font-medium ${
                          trade.actualReturn > 0 ? 'text-green-600 dark:text-green-400' : 
                          trade.actualReturn < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-900 dark:text-white'
                        }`}>
                          ${trade.actualReturn.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Joined: {new Date(trade.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">Total P&L</div>
                    <div className={`text-2xl font-bold ${
                      trade.actualReturn > 0 ? 'text-green-600 dark:text-green-400' : 
                      trade.actualReturn < 0 ? 'text-red-600 dark:text-red-400' : 
                      'text-gray-900 dark:text-white'
                    }`}>
                      {trade.actualReturn > 0 ? '+' : ''}${trade.actualReturn.toFixed(2)}
                    </div>
                    {trade.status === 'completed' && (
                      <div className={`text-sm ${
                        trade.actualReturn > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {trade.actualReturn > 0 ? 
                          `+${((trade.actualReturn / trade.entryAmount) * 100).toFixed(1)}%` :
                          `${((trade.actualReturn / trade.entryAmount) * 100).toFixed(1)}%`
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySignalTrades;