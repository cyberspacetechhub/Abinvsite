
import React, { useState } from 'react';
import { CircularProgress, Pagination } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import { useQuery } from 'react-query';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import InvestmentStatus from './InvestmentStatus';
import DeleteQuery from '../actionQuery/DeleteQuery';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Visibility, Edit, Delete } from '@mui/icons-material';

const AdminInvestments = () => {
  const fetch = useFetch();
  const url = `${baseURL}investment`;
  const delUrl = `${baseURL}transaction`;
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const fetchInvestments = async () => {
    const result = await fetch(`${url}?page=${page}&limit=10`, auth.accessToken);
    // console.log(result)
    return result.data;
  };

  const { data, isError, isLoading, isSuccess } = useQuery(
    ["investments", page],
     fetchInvestments,
    { keepPreviousData: true,
        staleTime: 10000,
        refetchOnMount:"always",
        onSuccess: () => {
          setTimeout(() => {
          }, 2000)
        }
    }
  );

  const [investment, setInvestment] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const [delId, setDelId] = useState('')
  const [openDel, setOpenDel] = useState(false)
  const handleOpenDel = () => setOpenDel(true)
  const handleCloseDel = () => setOpenDel(false)
  return (
    <div className='w-full'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Monitor and manage all investment transactions</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
          <Link 
            className={`pb-3 px-1 font-medium text-sm transition-colors duration-200 ${
              location.pathname === '/admin/transactions' 
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`} 
            to='/admin/transactions'
          >
            All
          </Link>
          <Link 
            className={`pb-3 px-1 font-medium text-sm transition-colors duration-200 ${
              location.pathname === '/admin/deposits' 
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`} 
            to='/admin/deposits'
          >
            Deposits
          </Link>
          <Link 
            className={`pb-3 px-1 font-medium text-sm transition-colors duration-200 ${
              location.pathname === '/admin/withdrawals' 
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`} 
            to='/admin/withdrawals'
          >
            Withdrawals
          </Link>
          <Link 
            className={`pb-3 px-1 font-medium text-sm transition-colors duration-200 ${
              location.pathname === '/admin/investments' 
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`} 
            to='/admin/investments'
          >
            Investments
          </Link>
        </div>
      </div>

      {/* Investments Table */}
      <div className="p-6 card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Investment Transactions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve investment requests</p>
          </div>
        </div>

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
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.investments?.length > 0 ? (
                    data.investments.map((investment) => (
                      <tr key={investment._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4 font-mono text-sm text-gray-900 dark:text-gray-300">
                          {investment._id.slice(-8)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                            {investment.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          ${investment.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            investment?.status === "Approved" 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : investment?.status === "Declined" 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {investment.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => navigate(`/admin/transaction-overview/${investment._id}`)} 
                              className="p-2 text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="View Details"
                            >
                              <Visibility className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                handleOpenModal();
                                setInvestment(investment);
                              }}
                              disabled={investment?.status === "Approved" || investment?.status === "Declined"}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                investment?.status === "Approved" || investment?.status === "Declined"
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              }`}
                              title="Update Status"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                handleOpenDel();
                                setDelId(investment._id);
                              }}
                              className="p-2 text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete"
                            >
                              <Delete className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No investments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {data?.investments?.length > 0 ? (
                data.investments.map((investment) => (
                  <div key={investment._id} className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{investment._id.slice(-8)}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        investment?.status === "Approved" 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : investment?.status === "Declined" 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {investment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                          {investment.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="font-semibold text-gray-900 dark:text-white">${investment.amount?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                      <p className="text-sm text-gray-900 dark:text-gray-300">{new Date(investment.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/admin/transaction-overview/${investment._id}`)} 
                        className="flex-1 px-3 py-2 text-xs text-blue-600 transition-colors duration-200 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          handleOpenModal();
                          setInvestment(investment);
                        }}
                        disabled={investment?.status === "Approved" || investment?.status === "Declined"}
                        className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors duration-200 ${
                          investment?.status === "Approved" || investment?.status === "Declined"
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30'
                        }`}
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          handleOpenDel();
                          setDelId(investment._id);
                        }}
                        className="px-3 py-2 text-xs text-red-600 transition-colors duration-200 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No investments found
                </div>
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        {data?.totalPage > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              count={data?.totalPage}
              page={page}
              onChange={handleChange}
              color="primary"
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <InvestmentStatus
        open={openModal}
        handleClose={handleCloseModal}
        investment={investment}
      />
      <DeleteQuery
        open={openDel}
        handleClose={handleCloseDel}
        delId={delId}
        url={delUrl}
      />
    </div>
  );
};

export default AdminInvestments;
