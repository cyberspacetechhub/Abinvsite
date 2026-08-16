import React, { useState } from 'react';
import useLogout from '../../hooks/useLogout';
import { Modal, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExitToApp, Close, Warning } from '@mui/icons-material';

const Logout = ({ open, handleClose }) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.info('Logging out...');
    
    setTimeout( async () => {
        await logout()
        setIsLoggingOut(false);
      }, 2000);
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      className="flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md overflow-hidden">
        <ToastContainer />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Warning className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
              <p className="text-red-100 text-sm">Are you sure you want to sign out?</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoggingOut}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Close className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ExitToApp className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                You will be signed out of your account
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Any unsaved changes will be lost
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <CircularProgress size={20} style={{color: 'white'}} />
              ) : (
                <>
                  <ExitToApp className="w-5 h-5" />
                  Sign Out
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Logout;