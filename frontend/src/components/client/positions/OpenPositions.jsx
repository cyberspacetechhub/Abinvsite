import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import OpenPosition from '../position/OpenPosition';

const OpenPositions = () => {
  const navigate = useNavigate();
  const fetch = useFetch();
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [stats, setStats] = useState({
    totalPairs: 0,
    totalProfit: 0,
    totalLoss: 0,
    netPL: 0
  });

  const positionsPerPage = 10;
  const url = `${baseURL}position/user`;
  const _id = auth?.user?._id;

  const fetchPositions = async () => {
    const result = await fetch(`${url}/${_id}`, auth.accessToken);
    return result.data;
  };

  const { data, isError, isLoading, isSuccess } = useQuery(
    ["position"],
    fetchPositions,
    { 
      keepPreviousData: true,
      staleTime: 10000,
      refetchOnMount: "always",
      enabled: !!_id
    }
  );

  useEffect(() => {
    if (data?.position) {
      const positions = data.position;
      const uniquePairs = [...new Set(positions.map(p => p.asset))];
      const totalProfit = positions.filter(p => !p.isLoss && p.status === 'closed').reduce((sum, p) => sum + parseFloat(p.profit || 0), 0);
      const totalLoss = positions.filter(p => p.isLoss && p.status === 'closed').reduce((sum, p) => sum + parseFloat(p.loss || 0), 0);
      
      setStats({
        totalPairs: uniquePairs.length,
        totalProfit,
        totalLoss: -totalLoss,
        netPL: totalProfit - totalLoss
      });
    }
  }, [data]);

  const paginatedPositions = data?.position ? data.position.slice((currentPage - 1) * positionsPerPage, currentPage * positionsPerPage) : [];
  const totalPages = data?.position ? Math.ceil(data.position.length / positionsPerPage) : 1;

  return (
    <div className="min-h-screen pt-20 md:ml-8 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-xl dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
            onClick={() => navigate(-1)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className='text-center'>
            <h1 className='mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text'>Open Positions</h1>
            <p className='text-xl text-gray-600 dark:text-gray-300'>Monitor your active trades</p>
          </div>
          
          <button
            onClick={() => setOpenModal(true)}
            className='px-6 py-3 font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-500 rounded-xl hover:scale-105'
          >
            Open Trade
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trading Pairs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPairs}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${stats.totalProfit.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Loss</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">${stats.totalLoss.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net P&L</p>
                <p className={`text-2xl font-bold ${stats.netPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${stats.netPL.toFixed(2)}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stats.netPL >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <svg className={`w-6 h-6 ${stats.netPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Positions</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-b-2 border-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Pair</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Type</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Leverage</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">P&L</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Open Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {paginatedPositions.map((position) => (
                      <tr key={position._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {position.asset}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${
                            position.type === 'buy' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {position.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">
                          ${position.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">
                          1:{position.leverage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            position.status === 'closed' 
                              ? 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700' 
                              : 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20'
                          }`}>
                            {position.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <span className={position.isLoss ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                            {position.status === 'closed' 
                              ? (position.isLoss ? `-$${position.loss}` : `+$${position.profit}`)
                              : 'Pending'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {new Date(position.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Open Trade Modal */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Open New Trade</h2>
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <OpenPosition />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenPositions;