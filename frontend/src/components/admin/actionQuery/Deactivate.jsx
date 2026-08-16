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

const Deactivate = ({ open, handleClose, userId }) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const update = useUpdate();
  const url = `${baseURL}user/deactivate`;
  const [isLoading, setIsLoading] = useState(false)

  const deactivateCompany = async () => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/auth/admin/login');
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

  const { mutate } = useMutation(deactivateCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries('client');
      handleClose();
      toast.success('Deactivated');
      setIsLoading(false)
    },
    onError: (error) => {
      toast.error(`Failed to deactivate: ${error.message}`);
    }
  });

  const handleDeactivate = () => {
    mutate();
  };


  return (
    <Modal 
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
   >
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        id="deleteModal"
        className="p-6 w-4/5 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4">
            Deactivate!
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to <span className='font-semibold text-gray-800 dark:text-white'>Deactivate</span> this user?
          </p>
            <div className="flex justify-center gap-4">
              <button
                className=" bg-green-500 px-2 py-2 rounded-lg text-white"
                onClick={handleDeactivate}
              >
                {isLoading ? <CircularProgress size={20} style={{color: 'white'}}/> : 'Deactivate'}
              </button>
              <button
                className=" bg-red-500 px-2 py-2 rounded-lg text-white"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
        </div>
      </div>
    </div>
  </Modal>
  );
};

export default Deactivate;
