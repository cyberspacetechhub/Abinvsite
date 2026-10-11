import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { LockOpen, CloudUpload, MarkEmailRead } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../shared/baseURL';
import LanguageSwitcher from '../common/LanguageSwitcher';

const AccountUnlock = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'submitted' | 'code'
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [tempCode, setTempCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !image) {
      toast.error('Please provide your email and a verification photo');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('verificationImage', image);
      await axios.post(`${baseURL}unlock/forgot-password`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStep('submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTempLogin = async (e) => {
    e.preventDefault();
    if (!tempCode.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${baseURL}unlock/temp-login`, { email, tempCode });
      toast.success('Account unlocked! Redirecting...');
      setTimeout(() => navigate('/auth/user/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />

      <header className="w-full border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 md:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/"><img src="/semlogo.png" alt="Logo" className="h-10 w-auto" /></Link>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="p-8 space-y-6">

              <div className="text-center">
                {step === 'submitted' ? (
                  <MarkEmailRead className="mx-auto mb-3 text-primary-600" style={{ fontSize: 48 }} />
                ) : (
                  <LockOpen className="mx-auto mb-3 text-primary-600" style={{ fontSize: 48 }} />
                )}
                <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                  {step === 'code' ? 'Enter Your Code' : 'Unlock Account'}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {step === 'form' && 'Upload a verification photo and we\'ll submit your unlock request to our team.'}
                  {step === 'submitted' && 'Your request has been submitted. Once approved, you\'ll receive a temporary login code by email.'}
                  {step === 'code' && `Enter the temporary code sent to ${email}`}
                </p>
              </div>

              {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your account email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Verification Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                      <CloudUpload className="absolute right-3 top-3.5 text-neutral-400" fontSize="small" />
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">
                      Photo of you holding a signed paper with your name and today's date
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {loading ? <CircularProgress size={18} style={{ color: 'white' }} /> : 'Submit Unlock Request'}
                  </button>
                </form>
              )}

              {step === 'submitted' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setStep('code')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    I already have a code
                  </button>
                  <button
                    onClick={() => setStep('form')}
                    className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              )}

              {step === 'code' && (
                <form onSubmit={handleTempLogin} className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Temporary Code
                    </label>
                    <input
                      type="text"
                      value={tempCode}
                      onChange={(e) => setTempCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white text-center text-lg font-mono placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {loading ? <CircularProgress size={18} style={{ color: 'white' }} /> : 'Login with Code'}
                  </button>
                  <button type="button" onClick={() => setStep('submitted')} className="w-full text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                    ← Back
                  </button>
                </form>
              )}

              <div className="pt-2 text-center space-y-2">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Forgot your password instead?{' '}
                  <Link to="/forgotpassword" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                    Reset password
                  </Link>
                </p>
                <Link to="/auth/user/login" className="block text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                  ← Back to Login
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountUnlock;
