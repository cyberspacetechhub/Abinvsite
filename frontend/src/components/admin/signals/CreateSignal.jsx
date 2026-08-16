import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { TrendingUp, Schedule, AttachMoney } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';

const CreateSignal = () => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    asset: '',
    entryPrice: '',
    targetPrice: '',
    percentageReturn: '',
    minEntryAmount: 100,
    scheduleTime: '',
    closingTime: ''
  });
  const [loading, setLoading] = useState(false);

  const fillSampleData = () => {
    const now = new Date();
    const scheduleTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    const closingTime = new Date(now.getTime() + 4 * 60 * 60000); // 4 hours from now
    
    setFormData({
      title: 'BTC/USD Bullish Breakout Signal',
      description: 'Bitcoin is showing strong bullish momentum with a breakout above key resistance at $45,000. Technical indicators suggest continued upward movement with RSI at 65 and MACD showing positive divergence. Entry recommended on current pullback.',
      asset: 'BTC/USD',
      entryPrice: '45250.00',
      targetPrice: '48500.00',
      percentageReturn: '7.2',
      minEntryAmount: 250,
      scheduleTime: scheduleTime.toISOString().slice(0, 16),
      closingTime: closingTime.toISOString().slice(0, 16)
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${baseURL}signal/create`, formData, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      toast.success('Signal created successfully');
      setFormData({
        title: '',
        description: '',
        asset: '',
        entryPrice: '',
        targetPrice: '',
        percentageReturn: '',
        minEntryAmount: 100,
        scheduleTime: '',
        closingTime: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create signal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Trading Signal</h2>
        </div>
        <button
          type="button"
          onClick={fillSampleData}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30 transition-colors"
        >
          Fill Sample Data
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Signal Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="BTC/USD Bullish Breakout Signal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asset Pair
                </label>
                <input
                  type="text"
                  name="asset"
                  value={formData.asset}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="BTC/USD"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Signal Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Bitcoin showing strong bullish momentum with breakout above $45,000 resistance..."
                required
              />
            </div>
          </div>

          {/* Price & Return Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Price & Return Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Price ($)
                </label>
                <input
                  type="number"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="45250.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  name="targetPrice"
                  value={formData.targetPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="48500.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  name="percentageReturn"
                  value={formData.percentageReturn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="7.2"
                  step="0.1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Timing & Entry Requirements */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Timing & Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Entry Amount ($)
                </label>
                <input
                  type="number"
                  name="minEntryAmount"
                  value={formData.minEntryAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="250"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduleTime"
                  value={formData.scheduleTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Closing Time
                </label>
                <input
                  type="datetime-local"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
            >
              {loading ? <CircularProgress size={20} style={{color: 'white'}} /> : <TrendingUp className="w-5 h-5" />}
              Create Trading Signal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSignal;