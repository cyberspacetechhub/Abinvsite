import React, { useState } from 'react'
import usePost from "../../../hooks/usePost";
// import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import countries from '../../utils/countries'


const CreateClient = ({open, handleClose}) => {
  const post = usePost();
  const navigate = useNavigate();
  const url = `${baseURL}client`;
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createAccount = async(data) => {
    setIsLoading(true);
    const formData = new FormData();
    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }
    for (let [key, value] of formData.entries()) {
      // console.log(`${key}: ${value}`);
    }
    try {
      const response = await post(url, formData);

      // console.log(response.data)
      toast.success("Account created successfully");
      setTimeout(() => {
        handleClose()
      }, 5000);
    } catch (err) {
      setIsLoading(false)
      switch (err.response.status) {
        case 409:
          toast.error('User already exists')
          break;
        case 401:
          toast.error('Unathorized')
          break;
        default:
          toast.error('Something went wrong, try again later')
          break;
      }
      // console.log(err)
    }
  }
  const {mutate} = useMutation(createAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries("clients");
      
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message);
    },
  });

  const handleCreateAccount = (data) => {
   mutate(data);
  }
  return (
    <Modal
      open={open}
      onClose={() => {handleClose()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <!-- Main modal --> */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Client</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create a new client account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {handleClose()}}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form 
              onSubmit={handleSubmit(handleCreateAccount)} 
              method='post'
              encType='multipart/form-data'
              className="space-y-4"
            >
              <div className="flex flex-col gap-2 mb-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Firstname
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    {...register("firstname", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter first name"
                    required=""
                  />
                  {errors.firstname && (
                    <span className="text-red-500 text-sm">
                      Firstname is required
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Lastname
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    {...register("lastname", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter last name"
                    required=""
                    />
                    {errors.lastname && (
                      <span className="text-red-500 text-sm">
                        Lastname is required
                      </span>
                    )}
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    {...register("username", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter username"
                    required=""
                    />
                    {errors.username && (
                      <span className="text-red-500 text-sm">
                        Username is required
                      </span>
                    )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type='email'
                    {...register("email", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      Email is required
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type='text'
                    {...register("phone", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">
                      Phone Number is required
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    {...register("country", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={'default'}
                  >
                    <option value="default">-- Select Country --</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <span className="text-red-500 text-sm">
                      Country is required
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Residential Address
                  </label>
                  <input
                    id="address"
                    type='text'
                    {...register("address", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter residential address"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm">
                      Residential address is required
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name='password'
                    type='password'
                    {...register("password", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      Password is required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {handleClose()}}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} style={{color: 'white'}} />
                      Creating...
                    </>
                  ) : (
                    'Create Client'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CreateClient
