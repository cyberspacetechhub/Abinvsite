import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import baseURL from '../../../shared/baseURL'
import { useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from 'react-query';

const PositionsOverview = () => {
    const fetch = useFetch();
    const url = `${baseURL}position/user`
    const { auth } = useAuth()

    const _id = auth?.user?._id
    // console.log(_id);
    
    const fetchPositions = async () => {
    const result = await fetch(`${url}/${_id}`, auth.accessToken);
    // console.log(result)
    return result.data;
    };
    
      const { data, isError, isLoading, isSuccess } = useQuery(
        ["position"],
         fetchPositions,
        { keepPreviousData: true,
            staleTime: 10000,
            refetchOnMount:"always",
            onSuccess: () => {
              setTimeout(() => {
              }, 2000)
            }
        }
      );

  return (
    <div className="space-y-4 pb-20">
      {data?.position?.length > 0 ? (
        data.position.map((trade, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${trade.type === 'buy' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                    <svg className={`w-4 h-4 ${trade.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trade.type === 'buy' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6"} />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">
                      {trade.asset}
                    </div>
                    <div className={`text-xs font-medium uppercase ${trade.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {trade.type}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-gray-800 dark:text-white">
                    ${trade.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {trade.status === 'closed' && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        trade.isLoss 
                          ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20' 
                          : 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/20'
                      }`}>
                        {trade.isLoss ? 'Loss' : 'Gain'}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trade.status === 'closed' 
                        ? 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700' 
                        : 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20'
                    }`}>
                      {trade.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Leverage: 1:{trade.leverage}</span>
                  <span>{new Date(trade.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`text-sm font-medium ${
                  trade.isLoss 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  P&L: {trade.isLoss ? `-$${trade.loss}` : `+$${trade.profit}`}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No positions found</h3>
          <p className="text-gray-600 dark:text-gray-400">Open your first position to start trading</p>
        </div>
      )}
    </div>
  );
};

export default PositionsOverview;
