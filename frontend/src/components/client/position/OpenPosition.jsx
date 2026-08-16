import { useForm } from 'react-hook-form';
import usePost from '../../../hooks/usePost';
import { useState } from 'react';
import baseURL from '../../../shared/baseURL'
import useAuth from '../../../hooks/useAuth';
import { toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";

const pairs = [
  { symbol: 'BTC/USD', label: 'Bitcoin / US Dollar (BTC/USD)' },
  { symbol: 'ETH/USD', label: 'Ethereum / US Dollar (ETH/USD)' },
  { symbol: 'BNB/USD', label: 'Binance Coin / US Dollar (BNB/USD)' },
  { symbol: 'SOL/USD', label: 'Solana / US Dollar (SOL/USD)' },
  { symbol: 'XRP/USD', label: 'Ripple / US Dollar (XRP/USD)' },
  { symbol: 'EUR/USD', label: 'Euro / US Dollar (EUR/USD)' },
  { symbol: 'USD/JPY', label: 'US Dollar / Japanese Yen (USD/JPY)' },
  { symbol: 'GBP/USD', label: 'British Pound / US Dollar (GBP/USD)' },
  { symbol: 'USD/CHF', label: 'US Dollar / Swiss Franc (USD/CHF)' },
  { symbol: 'AUD/USD', label: 'Australian Dollar / US Dollar (AUD/USD)' }
]

const tradingDurations = [
  { label: '30 Minutes', value: 30 },
  { label: '1 Hour', value: 60 },
  { label: '4 Hours', value: 240 },
  { label: '12 Hours', value: 720 },
  { label: '1 Day', value: 1440 },
  { label: '3 Days', value: 4320 },
  { label: '1 Week', value: 10080 },
  { label: '2 Weeks', value: 20160 },
  { label: '1 Month', value: 43200 },     // 30 days
  { label: '3 Months', value: 129600 },   // 90 days
  { label: '6 Months', value: 259200 },   // 180 days
  { label: '1 Year', value: 525600 }      // 365 days
];

const OpenPosition = () => {
  const post = usePost();
  const url = `${baseURL}position`;
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }

    try {
      const response = await post(url, formData, auth?.accessToken);
      return response;
    } catch (err) {
      switch (err.response?.status) {
        case 400:
          toast.error(err?.response.data.message);
          break;
        default:
          toast.error('Something went wrong, try again later');
          break;
      }
      throw err;
    }
  };

  const { mutate } = useMutation(onSubmit, {
    onSuccess: (response) => {
      toast.success(response?.data?.message || 'Position opened!');
      queryClient.invalidateQueries('client');
      queryClient.invalidateQueries('user');
      queryClient.invalidateQueries('position');
      reset();
    },
    onError: (error) => {
    //   toast.error(error?.message || 'Error occurred');
    },
  });

  const handleOpenPosition = (data) => {
    mutate(data);
  };

  const handleTradeClick = (type) => {
    setValue('type', type); // Sets the form value properly
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Open New Position</h2>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit(handleOpenPosition)} className="p-6 space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trading Pair</label>
          <select {...register('asset', { required: true })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" defaultValue={'default'}>
            <option value="default" disabled>-- Select Pair to Trade --</option>
            {
              pairs.map((p) => (
                <option key={p.symbol} value={p.symbol}>{p.label}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Amount</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg">USD</span>
            <input
              type="number"
              step="0.01"
              placeholder="Enter amount"
              {...register('amount', { required: true })}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leverage</label>
          <select {...register('leverage', { required: true })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" defaultValue={'default'}>
            <option value="default" disabled>-- Choose leverage --</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="5">5x</option>
            <option value="10">10x</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trading Duration</label>
          <select {...register('expiration', { required: true })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" defaultValue={'default'}>
            <option value="default" disabled>-- Select Trading Duration --</option>
            {
              tradingDurations.map((d) => (
                <option key={d.label} value={d.value}>{d.label}</option>
              ))
            }
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            onClick={() => handleTradeClick('buy')}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            BUY
          </button>
          <button
            type="submit"
            onClick={() => handleTradeClick('sell')}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            SELL
          </button>
        </div>

        <input type="hidden" {...register('type', { required: true })} />
        <input type="hidden" value={auth?.user?._id} {...register('userId')} />
      </form>
    </div>
  );
};

export default OpenPosition;