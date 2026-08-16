import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import useAuth from '../../../hooks/useAuth';
import useUpdate from '../../../hooks/useUpdate';
import { CircularProgress } from '@mui/material';
import baseURL from '../../../shared/baseURL';
import { useState } from 'react';

const Activate = ({ open, handleClose, userId }) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const update = useUpdate();
  const url = `${baseURL}user/activate`;
  const [isLoading, setIsLoading] = useState(false)

  const activateClient = async () => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login');
      return;
    }
    // const data = { _id: userId };
    // console.log(data);
    try {
      const response = await update(`${url}/${userId}`, {}, auth?.accessToken);
      // console.log(response); 
    } catch (error) {
      setIsLoading(false)
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const { mutate } = useMutation(activateClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('client');
      handleClose();
      toast.success('Activated');
      setIsLoading(false)
    },
    onError: (error) => {
      toast.error(`Failed to activate: ${error.message}`);
    }
  });

  const handleActivateClient = () => {
    mutate();
  };


  return (
    <Modal 
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
   >
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activate User
            </h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Are you sure you want to activate this user account? This will restore their access to the platform.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleActivateClient}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} style={{color: 'white'}} />
                  Activating...
                </>
              ) : (
                'Activate User'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
  );
};

export default Activate;
