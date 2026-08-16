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

const AdminUpdateClient = ({open, handleClose, client}) => {
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
      const response = await update(url, formData, auth?.accessToken);
      // console.log(response.data);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setIsLoading(false)
      setError(err.response?.data?.error || err.message)
    }
    // console.log(formData)
  };

  const {mutate} = useMutation(updateClient, {
    
    onSuccess : ()=>{
      setIsLoading(false)
      queryClient.invalidateQueries('client')
      toast.success('Client updated Successfully')

  
    }
  })

  const handleUpdateClient = (data) => {
    const newId = data.id
  mutate(data);  
};
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
        <div className="flex flex-col items-center justify-center px-6 mx-auto lg:py-0 h-svh ">
          <div className="relative w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 overflow-y-auto max-h-screen pb-10">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 overflow-y-scr">
              <h1 className=' text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl'>Update</h1>
              <button
                type="button"
                onClick={() => {handleClose()}}
                className="absolute -top-2 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 border border-gray-300 rounded-full text-sm p-1.5 ml-auto inline-flex items-center"
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
              <p className='text-gray-800'>Update Client Information!</p>
              <form 
              onSubmit={handleSubmit(handleUpdateClient)} 
              method='post'
              encType='multipart/form-data'
            >
              <div className="flex flex-col gap-2 mb-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Firstname
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    {...register("firstname", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500 "
                    placeholder="Type First name"
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500 "
                    placeholder="Enter the lastname"
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
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    {...register("username", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500  "
                    placeholder="Enter the username"
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
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type='email'
                    {...register("email", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500  "
                    placeholder="Enter Email here"
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
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type='text'
                    {...register("phone", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500  "
                    placeholder="Enter phone here"
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500 "
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-primary-500 "
                    placeholder="Enter residential address here"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm">
                      Residential address is required
                    </span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="text-green-50 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5"
              >
                {isLoading ? <CircularProgress size={24} style={{color: 'white'}} /> : 'Complete Update'}
              </button>
            </form>
            </div>
            {/* <!-- Modal body --> */}
            
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AdminUpdateClient
