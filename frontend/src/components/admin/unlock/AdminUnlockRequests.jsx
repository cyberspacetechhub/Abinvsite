import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { Visibility, CheckCircle, Cancel, Security, Key } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../shared/baseURL';
import useAuth from '../../../hooks/useAuth';
const AdminUnlockRequests = () => {
  const { auth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${baseURL}unlock/requests`);
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch unlock requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.put(`${baseURL}unlock/approve/${userId}`, {
        adminId: auth?.user._id
      });
      toast.success('Request approved and temporary code sent');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.put(`${baseURL}unlock/reject/${userId}`, {
        adminId: auth?.user._id
      });
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const getRequestTypeIcon = (status) => {
    return status === 'forgot-password' ? <Key className="w-5 h-5" /> : <Security className="w-5 h-5" />;
  };

  const getRequestTypeLabel = (status) => {
    return status === 'forgot-password' ? 'Forgot Password' : 'Account Unlock';
  };

  const getRequestTypeColor = (status) => {
    return status === 'forgot-password' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400' : 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Unlock Requests</h2>
        <span className="px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full dark:bg-orange-900/20 dark:text-orange-400 self-start sm:self-auto">
          {requests.length} Pending
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="py-12 text-center">
          <Security className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400">No pending unlock requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request._id} className="p-4 md:p-6 bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRequestTypeColor(request.unlockRequestStatus)}`}>
                      {getRequestTypeIcon(request.unlockRequestStatus)}
                      {getRequestTypeLabel(request.unlockRequestStatus)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {request.firstname} {request.lastname}
                  </h3>
                  <p className="mb-2 text-gray-600 dark:text-gray-400">{request.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(request.unlockRequestDate).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedImage(request.unlockRequestImage)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 text-sm"
                  >
                    <Visibility className="w-4 h-4" />
                    <span className="hidden sm:inline">View Image</span>
                    <span className="sm:hidden">View</span>
                  </button>
                  
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={actionLoading === request._id}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    {actionLoading === request._id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={actionLoading === request._id}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                  >
                    <Cancel className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto dark:bg-gray-800">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Verification Image</h3>
            </div>
            <div className="p-4">
              <img 
                src={selectedImage} 
                alt="Verification" 
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUnlockRequests;