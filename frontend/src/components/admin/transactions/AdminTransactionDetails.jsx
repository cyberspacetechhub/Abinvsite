import React from 'react'
import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import baseURL from '../../../shared/baseURL';
import { CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Person, Verified, ArrowBack, Schedule, AccountBalance, ContentCopy } from '@mui/icons-material';


const AdminTransactionDetails = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const url = `${baseURL}transaction`;
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null)
  const fetchTransaction = async () => {
    try {
      // Fetch the specific apartment details
      const result = await fetch(`${url}/${id}`, auth.accessToken);
        setTransaction(result.data);
        // console.log(result.data);
        return result.data
    } catch (error) {
      toast.error("Error fetching transaction's details");
      // console.log("Fetch error:", error);
    }
  };
  
  
  const { data, isError, isLoading, isSuccess } = useQuery(
    ["transaction"],
     fetchTransaction,
    { keepPreviousData: true,
        staleTime: 10000,
        refetchOnMount:"always",
        onSuccess: () => {
          setTimeout(() => {
          }, 2000)
        }
    }
  );
  let createdAt = transaction?.createdAt; // Example: "2024-12-03T14:25:36Z"
  let date = createdAt?.slice(0, 10); // "2024-12-03"
  let time = createdAt?.slice(11, 19); // "14:25:36"
  let dateTime = `${date} ${time}`; // "2024-12-03 14:25:36"
  let source = transaction?.source

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const value = transaction?.depositMethod?.value || transaction?.address || 'N/A';
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
    });
  };
  return (
    <div className='w-full'>
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowBack className="w-4 h-4" />
          Back to Transactions
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction Details</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Complete transaction information and user details</p>
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
          <p className="text-red-600 dark:text-red-400">Error fetching transaction details</p>
        </div>
      )}

      {/* Transaction Details */}
      {isSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Info Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AccountBalance className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Info</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transaction details and status</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${transaction?.amount?.toLocaleString() || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction?.type === 'Deposit' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : transaction?.type === 'Withdrawal'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {transaction?.type || 'N/A'}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction?.status === 'Approved' || transaction?.status === 'Completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : transaction?.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {transaction?.status || 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Schedule className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dateTime || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Method and wallet information</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Method</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {transaction?.depositMethod?.name || transaction?.withdrawalMethod?.name || source || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Wallet Address</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all flex-1">
                    {transaction?.depositMethod?.value || transaction?.withdrawalMethod?.address || source || 'N/A'}
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <ContentCopy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-1">Copied to clipboard!</p>
                )}
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <Person className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer details and verification</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {transaction?.user?.firstname?.slice(0,1) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction?.user?.firstname || 'N/A'} {transaction?.user?.lastname || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction?.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verification Status</span>
                  {transaction?.user?.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Verified className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                      <span className="text-sm font-medium">Unverified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTransactionDetails
