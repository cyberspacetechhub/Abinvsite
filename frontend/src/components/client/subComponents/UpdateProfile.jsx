import React, { useState, useEffect } from 'react'
import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import useUpdate from '../../../hooks/useUpdate';
import countries from '../../utils/countries'
import { useTranslation } from 'react-i18next';

const UpdateProfile = ({open, handleClose, client}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const update = useUpdate();
  const { auth } = useAuth();
  const url = `${baseURL}client`;
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const {id} = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all" });

  useEffect(() => {
    if (client) {
      Object.entries(client).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [client, setValue]);

  const updateClient = async (data) => {
    setIsLoading(true)
    if (!auth || !auth?.accessToken) {
      navigate('/')
      return;
    }
    const formData = new FormData();
  
    for ( const key in data) {
      formData.append(key, data[key]);
    }

    try{
      const response = await update(url, formData, auth?.accessToken);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setIsLoading(false)
      toast.error(err.response?.data?.error || err.message)
    }
  };

  const {mutate} = useMutation(updateClient, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('client')
      toast.success('Profile updated Successfully')
    }
  })

  const handleUpdateClient = (data) => {
    mutate(data);  
  };

  return (
    <Modal
      open={open}
      onClose={() => {handleClose()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <ToastContainer />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('profile.updateProfile')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {handleClose()}}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
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
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <form 
              onSubmit={handleSubmit(handleUpdateClient)} 
              method='post'
              encType='multipart/form-data'
              className="space-y-4"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {t('auth.firstName')}
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    {...register("firstname", { required: "First name is required" })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('auth.enterFirstName')}
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="lastname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {t('auth.lastName')}
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    {...register("lastname", { required: "Last name is required" })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('auth.enterLastName')}
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  {...register("username", { required: "Username is required" })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type='email'
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={t('auth.enterEmail')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('profile.phone')}
                </label>
                <input
                  id="phone"
                  type='text'
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('profile.country')}
                </label>
                <select
                  id="country"
                  {...register("country", { required: "Country is required" })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  defaultValue=""
                >
                  <option value="" disabled>-- Select Country --</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.name}>{country.name}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>
              
              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('profile.address')}
                </label>
                <input
                  id="address"
                  type='text'
                  {...register("address", { required: "Address is required" })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter residential address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {handleClose()}}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} style={{color: 'white'}} />
                      Updating...
                    </>
                  ) : (
                    t('common.save')
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

export default UpdateProfile