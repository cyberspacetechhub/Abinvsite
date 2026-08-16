import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import KYCReviewModal from './KYCReviewModal';

const AdminKYCReview = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const [selectedKYCId, setSelectedKYCId] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [page, setPage] = useState(1);

  const fetchPendingKYCs = async () => {
    try {
      const result = await fetch(`${baseURL}kyc/pending?page=${page}&limit=10`, auth.accessToken);
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery(
    ['pending-kycs', page],
    fetchPendingKYCs,
    { staleTime: 30000 }
  );

  const handleReview = (kyc) => {
    setSelectedKYCId(kyc._id);
    setReviewModal(true);
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
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pending KYC Reviews</h2>
        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
          {data?.total || 0} Pending
        </span>
      </div>

      {data?.kycs?.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No pending KYC submissions</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.kycs?.map((kyc) => (
            <div key={kyc._id} className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {kyc.userId.firstname} {kyc.userId.lastname}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{kyc.userId.email}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Document: {kyc.documentType}</span>
                    <span>Submitted: {new Date(kyc.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleReview(kyc)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  <Visibility className="w-4 h-4" />
                  Review
                </button>
              </div>
            </div>
          ))}
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

export default AdminKYCReview;