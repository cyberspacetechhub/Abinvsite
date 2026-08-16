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
import { useForm } from 'react-hook-form';

const OnMaintenanceAlert = ({ open, handleClose, userId }) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const update = useUpdate();
  const url = `${baseURL}client/onmain`;
  const [isLoading, setIsLoading] = useState(false)

  const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      reset,
    } = useForm();

  const onMainAlert = async (data) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login');
      return;
    }
    const formData = new FormData()
    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }

    try {
      const response = await update(`${url}/${userId}`, formData, auth?.accessToken);
      // console.log(response); 
    } catch (error) {
      setIsLoading(false)
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const { mutate } = useMutation(onMainAlert, {
    onSuccess: () => {
      queryClient.invalidateQueries('client');
      handleClose();
      toast.success('Maintenance mode activated');
      setIsLoading(false)
      reset()
    },
    onError: (error) => {
      toast.error(`Failed to activate: ${error.message}`);
    }
  });

  const handleOnMainAlert = (data) => {
    mutate(data);
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
            Turn-on Maintenance mode for this user!
          </h3>
          <form onSubmit={handleSubmit(handleOnMainAlert)} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            {/* <label htmlFor="receiver">Receiver</label> */}
            {/* <input type="hidden" value={userId} {...register('receiver')} className="border border-gray-300 p-2 rounded-md"> */}
              {/* <option value="">Select Receiver</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))} */}
            {/* </input> */}
          </div>
          <div className="flex flex-col gap-2">
            {/* <label htmlFor="subject">Sender</label> */}
            <input type="hidden" value={auth?.user?._id} {...register('sender')} className="border border-gray-300 p-2 rounded-md" />
          </div>
          {/* <div className="flex flex-col gap-2">
            <label htmlFor="subject">Subject</label>
            <input type="text" {...register('subject')} className="border border-gray-300 p-2 rounded-md" />
          </div> */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">Message</label>
            <textarea {...register('message')} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" rows="4" />
          </div>
            <div className="flex justify-center gap-4">
              <button
                className=" bg-green-500 px-2 py-2 rounded-lg text-white"
                type='submit'
              >
                {isLoading ? <CircularProgress size={20} style={{color: 'white'}} /> : 'Coninue'}
              </button>
              <button
                className=" bg-red-500 px-2 py-2 rounded-lg text-white"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Modal>
  );
};

export default OnMaintenanceAlert;
