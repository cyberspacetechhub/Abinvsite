import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { TrendingUp, CheckCircle, Cancel, Schedule } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';

const SignalList = () => {
  const { auth } = useAuth();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSignals = async () => {
    try {
      const response = await axios.get(`${baseURL}signal/all`, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      setSignals(response.data.signals);
    } catch (error) {
      toast.error('Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const markResult = async (signalId, result) => {
    setActionLoading(signalId);
    try {
      await axios.put(`${baseURL}signal/${signalId}/result`, { result }, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      toast.success(`Signal marked as ${result}`);
      fetchSignals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update signal');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'gain': return 'text-green-600 dark:text-green-400';
      case 'loss': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Signals</h2>
        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
          {signals.length} Total
        </span>
      </div>

      {signals.length === 0 ? (
        <div className="py-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No signals created yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {signals.map((signal) => (
            <div key={signal._id} className="p-6 card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {signal.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </span>
                    {signal.result && (
                      <span className={`font-medium ${getResultColor(signal.result)}`}>
                        {signal.result.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <p className="mb-3 text-gray-600 dark:text-gray-400">{signal.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Asset:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{signal.asset}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Entry:</span>
                      <p className="font-medium text-gray-900 dark:text-white">${signal.entryPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Target:</span>
                      <p className="font-medium text-gray-900 dark:text-white">${signal.targetPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Return:</span>
                      <p className="font-medium text-green-600 dark:text-green-400">{signal.percentageReturn}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-3 text-sm md:grid-cols-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Min Entry:</span>
                      <p className="font-medium text-gray-900 dark:text-white">${signal.minEntryAmount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Schedule:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(signal.scheduleTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Closing:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(signal.closingTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {(signal.status === 'active' || (signal.status === 'completed' && !signal.result)) && !signal.result && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => markResult(signal._id, 'gain')}
                      disabled={actionLoading === signal._id}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === signal._id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {signal.status === 'active' ? 'Close as Gain' : 'Mark Gain'}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => markResult(signal._id, 'loss')}
                      disabled={actionLoading === signal._id}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <Cancel className="w-4 h-4" />
                      {signal.status === 'active' ? 'Close as Loss' : 'Mark Loss'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignalList;