import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { LockReset, MarkEmailRead } from '@mui/icons-material';
import axios from 'axios';
import LanguageSwitcher from '../common/LanguageSwitcher';
import baseURL from '../../shared/baseURL';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'sent' | 'code'
  const [email, setEmail] = useState('');
  const [tempCode, setTempCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post(`${baseURL}user/reqpswdreset`, { email });
    } catch (_) {
      // swallow — always show generic message
    } finally {
      setLoading(false);
      setStep('sent');
    }
  };

  const handleTempLogin = async (e) => {
    e.preventDefault();
    if (!tempCode.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${baseURL}unlock/temp-login`, { email, tempCode });
      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/user'), 1500);
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
                {step === 'sent' ? (
                  <MarkEmailRead className="mx-auto mb-3 text-primary-600" style={{ fontSize: 48 }} />
                ) : (
                  <LockReset className="mx-auto mb-3 text-primary-600" style={{ fontSize: 48 }} />
                )}
                <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                  {step === 'code' ? 'Enter Your Code' : 'Forgot Password'}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {step === 'email' && 'Enter your email and we\'ll send you a reset link.'}
                  {step === 'sent' && 'If an account with that email exists, you will receive a reset link or temporary code shortly.'}
                  {step === 'code' && `Enter the temporary code sent to ${email}`}
                </p>
              </div>

              {step === 'email' && (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {loading ? <CircularProgress size={18} style={{ color: 'white' }} /> : 'Send Reset Link'}
                  </button>
                </form>
              )}

              {step === 'sent' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setStep('code')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    I have a temporary code
                  </button>
                  <button
                    onClick={() => setStep('email')}
                    className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Try a different email
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
                  <button type="button" onClick={() => setStep('sent')} className="w-full text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                    ← Back
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                Account locked?{' '}
                <Link to="/account-unlock" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                  Request unlock
                </Link>
              </p>

              <div className="text-center">
                <Link to="/auth/user/login" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
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

export default ForgotPassword;
