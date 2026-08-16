import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import ApproveUpgrade from './ApproveUpgrade';
import RejectUpgrade from './RejectUpgrade';

const PlanUpgrades = () => {
  const fetch = useFetch();
  const { auth } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const fetchUsersWithUpgradeRequests = async () => {
    const result = await fetch(`${baseURL}user/upgrade-requests`, auth.accessToken);
    return result.data;
  };

  const { data, isLoading, isError } = useQuery(
    ['upgradeRequests'],
    fetchUsersWithUpgradeRequests,
    {
      enabled: !!auth?.accessToken,
      refetchInterval: 30000
    }
  );

  const handleApprove = (user) => {
    setSelectedUser(user);
    setApproveModal(true);
  };

  const handleReject = (user) => {
    setSelectedUser(user);
    setRejectModal(true);
  };
console.log(data)
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Plan Upgrade Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage client plan upgrade requests</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <p className="text-red-600 dark:text-red-400">Error loading upgrade requests</p>
        </div>
      )}

      {data?.users?.length === 0 && (
        <div className="py-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full dark:bg-gray-700">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No upgrade requests pending</p>
        </div>
      )}

      {data?.users?.length > 0 && (
        <div className="overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Client</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Current Plan</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Upgrade Request</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Trading Balance</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data.users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstname} {user.lastname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                        {user.plan?.name || 'No Plan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.planUpgradeAlertMessage}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      ${user.tradingBalance?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleApprove(user)}
                        className="px-3 py-1 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className="px-3 py-1 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ApproveUpgrade
        open={approveModal}
        handleClose={() => setApproveModal(false)}
        user={selectedUser}
      />

      <RejectUpgrade
        open={rejectModal}
        handleClose={() => setRejectModal(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default PlanUpgrades;