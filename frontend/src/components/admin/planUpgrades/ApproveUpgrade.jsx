import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { Modal, Box } from '@mui/material';
import usePost from '../../../hooks/usePost';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import { toast } from 'react-toastify';

const ApproveUpgrade = ({ open, handleClose, user }) => {
  const post = usePost();
  const fetch = useFetch();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [availablePlans, setAvailablePlans] = useState([]);

  const { data: plansData } = useQuery(
    ['investmentPlans'],
    async () => {
      const result = await fetch(`${baseURL}investmentplan`, auth?.accessToken);
      return result.data;
    },
    { enabled: !!auth?.accessToken }
  );

  useEffect(() => {
    if (plansData?.investmentPlans) {
      setAvailablePlans(plansData.investmentPlans);
      // Auto-select the plan mentioned in the upgrade message
      const planName = extractPlanFromMessage(user?.planUpgradeAlertMessage);
      const matchingPlan = plansData.investmentPlans.find(plan => plan.name === planName);
      if (matchingPlan) {
        setSelectedPlan(matchingPlan._id);
      }
    }
  }, [plansData, user]);

  const approveMutation = useMutation(
    async () => {
      const response = await post(`${baseURL}investment/upgrade/approve`, {
        userId: user._id,
        newPlanId: selectedPlan,
        adminId: auth?.user?._id
      }, auth?.accessToken);
      return response;
    },
    {
      onSuccess: () => {
        toast.success('Plan upgrade approved successfully');
        queryClient.invalidateQueries(['upgradeRequests']);
        handleClose();
        setSelectedPlan('');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.error || 'Failed to approve upgrade');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    approveMutation.mutate();
  };

  // Extract plan from upgrade message
  const extractPlanFromMessage = (message) => {
    const match = message?.match(/Upgrade to (.+?) pending/);
    return match ? match[1] : '';
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Approve Plan Upgrade</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Approve upgrade request for {user?.firstname} {user?.lastname}
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
              Select Plan to Approve
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select a plan</option>
              {availablePlans.map(plan => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} - ${plan.minAmount.toLocaleString()} min
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Trading Balance
            </label>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              ${user?.tradingBalance?.toLocaleString() || '0'}
            </p>
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
              disabled={approveMutation.isLoading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {approveMutation.isLoading ? 'Approving...' : 'Approve Upgrade'}
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ApproveUpgrade;