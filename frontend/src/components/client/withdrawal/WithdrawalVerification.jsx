import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { Security, Send } from '@mui/icons-material';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import axios from 'axios';

const WithdrawalVerification = ({ onVerified, onCancel }) => {
  const { auth } = useAuth();
  const [step, setStep] = useState('generate'); // 'generate' or 'verify'
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}withdrawal-auth/generate-code/${auth?.user?._id}`,
        {},
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      
      toast.success('Verification code sent to your email');
      setStep('verify');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${baseURL}withdrawal-auth/verify-code/${auth?.user?._id}`,
        { code },
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      
      toast.success('Code verified successfully');
      onVerified();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Security className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Withdrawal Verification
        </h3>
      </div>

      {step === 'generate' ? (
        <div className="text-center">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            For security, we need to verify your withdrawal request with a verification code.
          </p>
          <button
            onClick={generateCode}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 mx-auto text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <CircularProgress size={16} />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Code to Email
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Enter the 6-digit verification code:
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full px-4 py-3 mb-4 text-center text-lg font-mono border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-3">
            <button
              onClick={verifyCode}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <CircularProgress size={16} /> : 'Verify Code'}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalVerification;