import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import axios from 'axios';

const WithdrawalControls = ({ user, onUpdate }) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);

  const toggleWithdrawal = async (enable) => {
    setLoading(true);
    try {
      const endpoint = enable ? 'enable' : 'disable';
      await axios.put(
        `${baseURL}withdrawal-auth/${endpoint}/${user._id}`,
        {},
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      
      toast.success(`Withdrawal ${enable ? 'enabled' : 'disabled'} for user`);
      onUpdate?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating withdrawal status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Withdrawal:</span>
      {user?.withdrawalEnabled ? (
        <button
          onClick={() => toggleWithdrawal(false)}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
        >
          {loading ? <CircularProgress size={12} /> : <Lock className="w-3 h-3" />}
          Disable
        </button>
      ) : (
        <button
          onClick={() => toggleWithdrawal(true)}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400"
        >
          {loading ? <CircularProgress size={12} /> : <LockOpen className="w-3 h-3" />}
          Enable
        </button>
      )}
    </div>
  );
};

export default WithdrawalControls;