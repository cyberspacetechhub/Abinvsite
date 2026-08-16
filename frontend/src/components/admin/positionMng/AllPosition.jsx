import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import baseURL from '../../../shared/baseURL'
import useAuth from '../../../hooks/useAuth';
import { useQuery } from 'react-query';
import MarkTradeAsLoss from '../actionQuery/MarkTradeAsLoss';
import { ToastContainer } from 'react-toastify';
import { TrendingUp, TrendingDown, Person, AttachMoney } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const AllPosition = () => {
    const fetch = useFetch();
    const url = `${baseURL}position`
    const { auth } = useAuth()

    const fetchPositions = async () => {
    const result = await fetch(`${url}`, auth.accessToken);
    return result.data;
    };
    
      const { data, isError, isLoading, isSuccess } = useQuery(
        ["positions"],
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

    const [position, setPosition] = useState("")
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <div className='w-full'>
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Position Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and manage all trading positions</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-20">
          <CircularProgress />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">Error fetching positions</p>
        </div>
      )}

      {/* Positions Grid */}
      {isSuccess && (
        <div className="space-y-4">
          {data?.positions?.length > 0 ? (
            data.positions.map((trade, idx) => (
              <div key={idx} className="card p-6 hover:shadow-lg transition-all duration-300">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      trade.type === 'buy' 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      {trade.type === 'buy' ? (
                        <TrendingUp className={`w-6 h-6 text-green-600 dark:text-green-400`} />
                      ) : (
                        <TrendingDown className={`w-6 h-6 text-red-600 dark:text-red-400`} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {trade.asset}
                        <span className={`ml-2 text-sm font-medium ${
                          trade.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Leverage: 1:{trade.leverage}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${trade.amount?.toLocaleString()}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      trade.status === 'closed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {trade.status === 'closed' ? 'Closed' : 'Open'}
                    </span>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Person className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Trader: <span className="font-medium text-gray-900 dark:text-white">{trade.userId.username}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AttachMoney className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      P&L: <span className={`font-medium ${
                        trade.isLoss ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {trade.isLoss ? `- $${trade.loss}` : `+ $${trade.profit}`}
                      </span>
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(trade.createdAt).toLocaleDateString()} at {new Date(trade.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                {/* Status Badge and Action */}
                <div className="flex justify-between items-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    trade.isLoss 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {trade.isLoss ? 'Loss' : 'Gain'}
                  </span>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      trade.isLoss || trade.status === 'closed'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    onClick={() => {
                      setPosition(trade._id)
                      handleOpen()
                    }}
                    disabled={trade.isLoss || trade.status === 'closed'}
                  >
                    {trade.isLoss ? 'Already Loss' : trade.status === 'closed' ? 'Closed' : 'Mark As Loss'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Positions</h3>
              <p className="text-gray-600 dark:text-gray-400">No trading positions found</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <MarkTradeAsLoss open={open} handleClose={handleClose} positionId={position} />
    </div>
  );
};

export default AllPosition;
