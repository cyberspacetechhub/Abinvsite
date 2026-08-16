import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Modal, Box } from '@mui/material';
import usePost from '../../../hooks/usePost';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import { toast } from 'react-toastify';

const RejectUpgrade = ({ open, handleClose, user }) => {
  const post = usePost();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');

  const rejectMutation = useMutation(
    async () => {
      const response = await post(`${baseURL}investment/upgrade/reject`, {
        userId: user._id,
        reason,
        adminId: auth?.user?._id
      }, auth?.accessToken);
      return response;
    },
    {
      onSuccess: () => {
        toast.success('Plan upgrade rejected');
        queryClient.invalidateQueries(['upgradeRequests']);
        handleClose();
        setReason('');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.error || 'Failed to reject upgrade');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate();
  };

  const extractPlanFromMessage = (message) => {
    const match = message?.match(/Upgrade to (.+?) pending/);
    return match ? match[1] : '';
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reject Plan Upgrade</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Reject upgrade request for {user?.firstname} {user?.lastname}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Request
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">
                {user?.planUpgradeAlertMessage}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requested Plan
            </label>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {extractPlanFromMessage(user?.planUpgradeAlertMessage)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Rejection *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter reason for rejecting this upgrade request..."
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rejectMutation.isLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Upgrade'}
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default RejectUpgrade;