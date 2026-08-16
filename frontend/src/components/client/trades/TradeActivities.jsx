import React from 'react';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Timeline } from '@mui/icons-material';

const TradeActivities = () => {
  const fetch = useFetch();
  const {auth} = useAuth();
  const url = `${baseURL}trade/activities/${auth.user?._id}`;

  const { data, isLoading, isError } = useQuery(
    ['tradeActivities', auth.user?._id],
    async () => {
      const result = await fetch(url, auth.accessToken);
      return result.data;
    },
    {
      refetchInterval: 30000,
      enabled: !!auth.user?._id
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600 dark:text-red-400">Error loading trade activities</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-20 md:ml-8 bg-gray-50 dark:bg-gray-900'>
      <div className="px-4 py-8 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
          <Timeline className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trade Activities</h2>
          <p className="text-gray-600 dark:text-gray-400">Last 24 hours trading performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/30">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data?.summary?.totalProfit || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/30">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Loss</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(data?.summary?.totalLoss || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <Timeline className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net P&L</p>
              <p className={`text-2xl font-bold ${
                (data?.summary?.netPL || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(data?.summary?.netPL || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 card">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
        
        {data?.activities?.length > 0 ? (
          <div className="space-y-3">
            {data.activities.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'profit' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {activity.type === 'profit' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Trade {activity.type === 'profit' ? 'Win' : 'Loss'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.investment?.investmentPlan?.name || 'Trading Plan'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(activity.processedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    activity.type === 'profit' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {activity.type === 'profit' ? '+' : '-'}{formatCurrency(activity.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No trade activities in the last 24 hours</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TradeActivities;