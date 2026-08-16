import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { TrendingUp, AttachMoney, Schedule, MyLocation } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../shared/baseURL';
import Countdown from '../../utils/Countdown';
import useAuth from '../../../hooks/useAuth';

const SignalTrading = () => {
  const { auth } = useAuth();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null);
  const [entryAmounts, setEntryAmounts] = useState({});

  const fetchActiveSignals = async () => {
    try {
      if (!auth.accessToken) {
        toast.error('No authentication token');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${baseURL}signal/active`, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      // console.log(response)
      setSignals(response.data.signals);
    } catch (error) {
      // console.error('Fetch signals error:', error.response?.data);
      toast.error('Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSignals();
  }, []);

  const handleEntryAmountChange = (signalId, amount) => {
    setEntryAmounts({ ...entryAmounts, [signalId]: amount });
  };

  const joinSignal = async (signalId) => {
    const entryAmount = entryAmounts[signalId];
    if (!entryAmount) {
      toast.error('Please enter an amount');
      return;
    }

    setJoinLoading(signalId);
    try {
      await axios.post(`${baseURL}signal/${signalId}/join`, { entryAmount: parseFloat(entryAmount) }, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      toast.success('Successfully joined signal!');
      setEntryAmounts({ ...entryAmounts, [signalId]: '' });
      fetchActiveSignals();
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to join signal');
    } finally {
      setJoinLoading(null);
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
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 md:ml-8">
      <ToastContainer />
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trading Signals</h1>
            <p className="text-gray-600 dark:text-gray-400">Join active trading signals and earn profits</p>
          </div>
        </div>

        {signals.length === 0 ? (
          <div className="p-12 text-center card-elevated">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Active Signals</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new trading opportunities</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {signals.map((signal) => (
              <div key={signal._id} className="p-6 card-elevated">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {signal.title}
                      </h3>
                      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
                        ACTIVE
                      </span>
                    </div>
                    
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{signal.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <MyLocation className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Asset</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{signal.asset}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <AttachMoney className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Entry Price</p>
                          <p className="font-semibold text-gray-900 dark:text-white">${signal.entryPrice}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Target Price</p>
                          <p className="font-semibold text-gray-900 dark:text-white">${signal.targetPrice}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expected Return</p>
                          <p className="font-bold text-green-600 dark:text-green-400">{signal.percentageReturn}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Min Entry: ${signal.minEntryAmount}</span>
                      <div className="flex flex-col gap-1">
                        {new Date(signal.scheduleTime) > new Date() ? (
                          <Countdown 
                            targetDate={signal.scheduleTime} 
                            label="Opens in" 
                            onComplete={() => fetchActiveSignals()}
                          />
                        ) : (
                          <Countdown 
                            targetDate={signal.closingTime} 
                            label="Closes in" 
                            onComplete={() => fetchActiveSignals()}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Join Signal</h4>
                      
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Entry Amount ($)
                        </label>
                        <input
                          type="number"
                          value={entryAmounts[signal._id] || ''}
                          onChange={(e) => handleEntryAmountChange(signal._id, e.target.value)}
                          className="input-field"
                          placeholder={`Min: $${signal.minEntryAmount}`}
                          min={signal.minEntryAmount}
                          step="0.01"
                        />
                      </div>
                      
                      {entryAmounts[signal._id] && (
                        <div className="p-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <p className="text-sm text-blue-800 dark:text-blue-400">
                            Expected Profit: <span className="font-bold">
                              ${(entryAmounts[signal._id] * signal.percentageReturn / 100).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => joinSignal(signal._id)}
                        disabled={joinLoading === signal._id || !entryAmounts[signal._id]}
                        className="flex items-center justify-center w-full gap-2 btn-primary"
                      >
                        {joinLoading === signal._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            Join Signal
                          </>
                        )}
                      </button>
                    </div>
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

export default SignalTrading;