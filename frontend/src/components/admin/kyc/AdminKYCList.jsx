import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import { CheckCircle, Cancel, Schedule, Visibility } from '@mui/icons-material';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import KYCReviewModal from './KYCReviewModal';

const AdminKYCList = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedKYCId, setSelectedKYCId] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);

  const fetchAllKYCs = async () => {
    try {
      const endpoint = filter === 'all' ? 'all' : 'pending';
      const result = await fetch(`${baseURL}kyc/${endpoint}?page=${page}&limit=10`, auth.accessToken);
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery(
    ['all-kycs', page, filter],
    fetchAllKYCs,
    { staleTime: 30000 }
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <Cancel className="w-5 h-5 text-red-500" />;
      case 'pending': return <Schedule className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600 dark:text-red-400">Error loading KYC submissions</p>
      </div>
    );
  }

  return (
    <div className="p-">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All KYC Submissions</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All ({data?.total || 0})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {data?.kycs?.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No KYC submissions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Document Type
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Submitted
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Reviewed By
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {data?.kycs?.map((kyc) => (
                <tr key={kyc._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {kyc.userId.firstname} {kyc.userId.lastname}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {kyc.userId.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    {kyc.documentType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(kyc.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(kyc.status)
                      }`}>
                        {kyc.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {new Date(kyc.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {kyc.reviewedBy ? 
                      `${kyc.reviewedBy.firstname} ${kyc.reviewedBy.lastname}` : 
                      '-'
                    }
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button 
                      onClick={() => {
                        setSelectedKYCId(kyc._id);
                        setReviewModal(true);
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      <Visibility className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded ${
                page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
      
      <KYCReviewModal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        kycId={selectedKYCId}
        onSuccess={() => {
          // Refresh data after successful action
        }}
      />
    </div>
  );
};

export default AdminKYCList;