
import React from 'react'
import { useState } from 'react';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL  from '../../../shared/baseURL';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Pagination } from '@mui/material';
import DeleteClient from '../adminClient/DeleteClient';
import CreateClient from '../adminClient/CreateClient';
import { ToastContainer } from 'react-toastify';
import SendMessage from '../messages/SendMessage';
import SearchBar from './SearchBar';
import { TrendingUp, TrendingDown, AccountBalance, People, AttachMoney } from '@mui/icons-material';

const AdminClients = () => {

  const {auth} = useAuth();
  const fetch = useFetch();
  const url = `${baseURL}client`
  const navigate = useNavigate();
  
  const [openModal, setOpenModal] = useState()
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  //delete property modal
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);
  const [clientId, setClientId] = useState("")

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const getClients = async () => {
    const result = await fetch(`${url}?page=${page}&limit=10`, auth.accessToken);
    return result.data;
  };

  const { data, isError, isLoading, isSuccess } = useQuery(
    ["clients", page],
     getClients,
    { keepPreviousData: true,
        staleTime: 10000,
        refetchOnMount:"always",
        onSuccess: () => {
          setTimeout(() => {
          }, 2000)
        }
    }
  );

  const totalDeposit = data?.clients
  ?.reduce((clientAcc, client) => {
    const clientDeposits = client.transactions
      ?.filter(transaction => transaction.type === "Deposit")
      ?.reduce((transAcc, transaction) => transAcc + (transaction.amount || 0), 0) || 0;
    return clientAcc + clientDeposits;
  }, 0) || 0;

  const totalWithdrawal = data?.clients
  ?.reduce((clientAcc, client) => {
    const clientWithdrawals = client.transactions
      ?.filter(transaction => transaction.type === "Withdrawal")
      ?.reduce((transAcc, transaction) => transAcc + (transaction.amount || 0), 0) || 0;
    return clientAcc + clientWithdrawals;
  }, 0) || 0;

  const totalInvestment = data?.clients
  ?.reduce((clientAcc, client) => {
    const clientInvestments = client.transactions
      ?.filter(transaction => transaction.type === "Investment")
      ?.reduce((transAcc, transaction) => transAcc + (transaction.amount || 0), 0) || 0;
    return clientAcc + clientInvestments;
  }, 0) || 0;

const totalTransactions = data?.clients
  ?.reduce((clientAcc, client) => {
    const clientTotal = client.transactions
      ?.reduce((transAcc, transaction) => transAcc + (transaction.amount || 0), 0) || 0;
    return clientAcc + clientTotal;
  }, 0) || 0;

  const handleUserSelect = (user) => {
    // console.log("Selected User:", user);
  };

  const metrics = [
    {
      title: "Total Clients",
      value: data?.clients?.length?.toString().padStart(2, '0') || '00',
      icon: People,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: AccountBalance,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Total Deposits",
      value: totalDeposit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: TrendingUp,
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Total Withdrawals",
      value: totalWithdrawal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: TrendingDown,
      color: "red",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Total Investments",
      value: totalInvestment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: AttachMoney,
      color: "amber",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400"
    }
  ];
  return (
    <div className='w-full'>
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and manage all platform clients</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`card p-4 ${metric.bgColor} border-l-4 border-${metric.color}-500`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{metric.title}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-full ${metric.bgColor} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client Management Section */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Clients</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor your clients</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <SearchBar onSelect={handleUserSelect} />
            <button 
              onClick={handleOpenModal} 
              className="btn-primary whitespace-nowrap"
            >
              + New Client
            </button>
          </div>
        </div>

        {/* Client Table */}
        {isLoading && (
          <div className="flex items-center justify-center p-20">
            <CircularProgress />
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error fetching data</p>
          </div>
        )}
        
        {isSuccess && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">User Info</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Date Created</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Verification</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.clients?.length > 0 ? (
                  data.clients.map((client) => (
                    <tr key={client._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10">
                            {client.profile ? (
                              <img
                                className="h-full w-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                src={client.profile}
                                alt="Profile"
                              />
                            ) : (
                              <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{client.firstname.slice(0,1)}</span>
                              </div>
                            )}
                            <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${client.isActive ? 'bg-green-400' : 'bg-red-500'}`}></span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{`${client.firstname} ${client.lastname}`}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {client.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300">{new Date(client.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.isVerified 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {client.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300">{client.phone}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/admin/client_details/${client._id}`)} 
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              handleOpen();
                              setClientId(client._id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
                          >
                            Message
                          </button>
                          <button 
                            onClick={() => {
                              handleOpenDelete();
                              setClientId(client._id);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
      <DeleteClient open={openDelete} handleClose={handleDeleteClose} clientId={clientId} url={url} />
      <CreateClient open={openModal} handleClose={handleCloseModal} />
      <SendMessage open={open} handleClose={handleClose} userId={clientId} />
    </div>
  )
}

export default AdminClients
