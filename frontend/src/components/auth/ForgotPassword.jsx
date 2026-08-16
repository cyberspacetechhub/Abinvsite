import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { CloudUpload, Security } from '@mui/icons-material';
import axios from 'axios';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request' or 'temp-login'
  const [email, setEmail] = useState('');
  const [verificationImage, setVerificationImage] = useState(null);
  const [tempCode, setTempCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      setVerificationImage(file);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!email || !verificationImage) {
      toast.error('Please provide email and verification image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('verificationImage', verificationImage);

      await axios.post('/api/unlock/forgot-password', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Password reset request submitted! Admin will review and send you a temporary login code.');
      setStep('temp-login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTempLogin = async (e) => {
    e.preventDefault();
    
    if (!tempCode.trim()) {
      toast.error('Please enter the temporary code');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/unlock/temp-login', {
        email,
        tempCode
      });
      
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/user');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid temporary code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <img src="/semlogo.png" alt="Stock Exchange Mining" className="h-12 md:h-16" />
          <LanguageSwitcher />
        </div>
      </div>
      <ToastContainer />
      <div className="container mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <Security className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {step === 'request' ? 'Forgot Password' : 'Enter Temporary Code'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'request' 
              ? 'Upload verification photo to reset your password'
              : 'Enter the temporary code sent to your email'
            }
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            {step === 'request' ? (
              <form onSubmit={handleSubmitRequest}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Verification Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3 px-4 pr-12 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                      <CloudUpload className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                      Photo of you holding signed paper with your name and today's date
                    </small>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={20} style={{color: 'white'}} /> : 'Submit Request'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleTempLogin}>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      A temporary login code has been sent to <strong>{email}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Temporary Code
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3 px-4 text-center text-lg font-mono text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={tempCode}
                      onChange={(e) => setTempCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={20} style={{color: 'white'}} /> : 'Login with Temp Code'}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <Link 
                to="/auth/user/login" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;