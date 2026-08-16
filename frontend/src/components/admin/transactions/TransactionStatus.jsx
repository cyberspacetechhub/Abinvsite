import React, { useState, useEffect } from 'react';
import useAuth from "../../../hooks/useAuth";
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import useFetch from "../../../hooks/useFetch";  
import useUpdate from "../../../hooks/useUpdate";
import { CircularProgress } from '@mui/material';

const TransactionStatus = ({open, handleClose, transaction, url}) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetch = useFetch();
  const update = useUpdate();
  const [isLoading, setIsLoading] = useState(false)

  // console.log(url)
  // const isApproved = status === "Approved";

  const { 
    register,
    setValue,
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  useEffect(() => {
    if (transaction) {
      Object.entries(transaction).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [transaction, setValue]);

  const updateStatus = async (status) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login');
      return;
    }
    // console.log(status)
     const formData = new FormData();
     formData.append("status", status);
    try {
      const response = await update(`${url}/${transaction._id}`, formData, auth?.accessToken);
      // console.log(response.data);
        setTimeout(() => {
          toast.success(`Transaction Status Updated Successfuly`);
          handleClose(); 
        }, 2000);
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message);
    }
  };

  const { mutate } = useMutation(updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
      setIsLoading(false)
    }
  });

  const handleStatusUpdate = (data) => {
    mutate(data.status);
    
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className='flex justify-center items-center'
    >
      <div className=' w-96 py-4 px-4 bg-white relative '>
      Update Transaction Status
      <form onSubmit={handleSubmit(handleStatusUpdate)}
        className=' mx-auto'
      >
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status:
          </label>
          <select
            id="status"
            {...register("status", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            disabled={transaction?.status === "Approved"}
          >
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Declined</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-coral500"
          // disabled={isApproved}
        >
          {isLoading ? <CircularProgress size={20} style={{color: 'white'}} /> : 'Update Status'}
          
        </button>
      </form>
      {/* Update Shop Status */}
    </div>
    </Modal>
  )
}

export default TransactionStatus
