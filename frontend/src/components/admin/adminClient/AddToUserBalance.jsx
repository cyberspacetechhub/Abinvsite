import React, { useState, useEffect } from 'react'
import usePost from "../../../hooks/usePost";
import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useFetch from '../../../hooks/useFetch';

const AddToUserBalance = ({open, handleClose, userId}) => {
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}user/fund`;
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const fetch = useFetch()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

 
  const addBalance = async (data) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/login')
      return;
    }
    const formData = new FormData();
  
  // Append form fields
  for ( const key in data) {
    formData.append(key, data[key]);
  }

  // Log the FormData contents
  for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
  }
    try{
      const response = await post(`${url}/${userId}`, formData, auth?.accessToken);
      // console.log(response.data);
      
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
    // console.log(formData)
  };

  const {mutate} = useMutation(addBalance, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('client')
      toast.success('Credit Successfull')
      setTimeout(() => {
        handleClose();
      }, 3000);
  
    }
  })

  const handleAddBalance = (data) => {
  mutate(data);  
};
  // console.log(auth)
  return (
    <Modal
      open={open}
      onClose={() => {handleClose()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <!-- Main modal --> */}
      <div
        id="defaultModal"
        className=" overflow-y-auto overflow-x-hidden absolute top-10  z-50 justify-center items-center w-full outline-none "
      >
        <ToastContainer />
        <div className="flex flex-col items-center justify-center px-6 mx-auto lg:py-0 h-dvh">
          {/* <!-- Modal content --> */}
          <div className="relative w-full bg-white dark:bg-gray-800 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 overflow-y-auto max-h-screen pb-3">
            {/* <!-- Modal header --> */}
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                Credit
              </h3>
              <button
                type="button"
                onClick={() => {handleClose()}}
                className="text-gray-400 dark:text-gray-300 bg-transparent dark:bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 rounded-full text-sm p-1.5 ml-auto inline-flex items-center absolute border border-gray-800 dark:border-gray-700 right-3 top-0"
                data-modal-toggle="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            <form 
              onSubmit={handleSubmit(handleAddBalance)} 
              method='post'
              // encType='multipart/form-data'
            >
                <div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="amount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Amount
                  </label>
                  <input
                    className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-y-gray-700 focus:ring-green-500 focus:border-primary-500 "
                    id="amount"
                    type='number'
                    {...register("amount", {
                      required: "Amount is required",
                      
                    })}
                  />
                  <p className="text-red-500 text-sm">
                    {errors.amount && <span>Amount is required</span>}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="text-green-50 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5"
              >
                
                {isLoading ? <CircularProgress size={20} style={{color: 'white'}} /> : 'Credit'}
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddToUserBalance;