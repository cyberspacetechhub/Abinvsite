import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { CloudUpload, Security } from '@mui/icons-material';
import baseURL from '../../shared/baseURL';
import axios from 'axios';

const AccountUnlock = ({ userEmail, onSuccess, onBack }) => {
  const [step, setStep] = useState('upload'); // 'upload' or 'temp-login'
  const [loading, setLoading] = useState(false);
  const [unlockImage, setUnlockImage] = useState(null);
  const [tempCode, setTempCode] = useState('');
  const [email, setEmail] = useState(userEmail || '');

  const handleImageUpload = (e) => {
    setUnlockImage(e.target.files[0]);
  };

  const submitUnlockRequest = async () => {
    if (!email || !unlockImage) {
      toast.error('Please provide email and verification image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('verificationImage', unlockImage);

    try {
      await axios.post(`${baseURL}unlock/forgot-password`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Unlock request submitted. Please wait for admin approval.');
      setStep('temp-login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting unlock request');
    } finally {
      setLoading(false);
    }
  };

  const handleTempLogin = async () => {
    if (!tempCode.trim()) {
      toast.error('Please enter the temporary code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}unlock/temp-login`, {
        email,
        tempCode
      });
      
      toast.success('Account unlocked successfully!');
      onSuccess(response.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid temporary code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Security className="w-6 h-6 text-red-600 dark:text-red-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Account Locked
        </h3>
      </div>

      {step === 'upload' ? (
        <div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Your account has been locked due to multiple failed login attempts. 
            To unlock your account, please upload a photo of yourself holding a signed paper with your name and today's date.
          </p>
          
          {!userEmail && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Verification Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <CloudUpload className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={submitUnlockRequest}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? <CircularProgress size={16} /> : 'Submit Unlock Request'}
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Back
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Your unlock request has been submitted. Once approved by an admin, 
            you will receive a temporary login code via email.
          </p>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Temporary Code
            </label>
            <input
              type="text"
              value={tempCode}
              onChange={(e) => setTempCode(e.target.value)}
              placeholder="Enter 6-digit code from email"
              maxLength={6}
              className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleTempLogin}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <CircularProgress size={16} /> : 'Login with Temp Code'}
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Back
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountUnlock;