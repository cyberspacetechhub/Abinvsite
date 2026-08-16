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

const Verify = ({ open, handleClose, userId }) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 
  const update = useUpdate();
  const url = `${baseURL}client/verify`;
  const [isLoading, setIsLoading] = useState(false)

  const verifyClient = async () => {
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
      throw new Error(error.response?.data?.message || 'Error verifying client');
    }
  };

  const { mutate } = useMutation(verifyClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('client');
      handleClose();
      toast.success('Verification Successfull');
      setIsLoading(false)
    },
    onError: (error) => {
      toast.error(`Failed to verify: ${error.message}`);
    }
  });

  const handleverifyClient = () => {
    mutate();
  };


  return (
    <Modal 
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
   >
    <div className='bg-white dark:bg-gray-800'>
      <div
        id="deleteModal"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-4/5 max-w-md bg-white rounded-lg shadow-lg"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4">
            Verify
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to verify this user?
          </p>
            <div className="flex justify-center gap-4">
              <button
                className=" bg-green-500 px-2 py-2 rounded-lg text-white"
                onClick={handleverifyClient}
              >
                {isLoading ? <CircularProgress size={20} style={{color: 'white'}} /> : 'Verify'}
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

export default Verify;
