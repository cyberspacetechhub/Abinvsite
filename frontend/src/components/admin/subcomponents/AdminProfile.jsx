import { useEffect, useState } from 'react';
import React from 'react';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import baseURL from '../../../shared/baseURL';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
// import UpdateProfile from './UpdateProfile';
import { ToastContainer, toast } from 'react-toastify';
import { Camera, Photo, PhotoCamera, Verified } from '@mui/icons-material';
import UploadProfile from '../../utils/Uploadprofile';

const AdminProfile = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const url = `${baseURL}admin`;
  const { id } = useParams();
  
  // //updatemodal
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const handleUpdateOpen = () => setOpenUpdate(true);
  const handleUpdateClose = () => setOpenUpdate(false);

  const handleOpenUpload = () => setOpenUpload(true)
  const handleCloseUpload = () => setOpenUpload(false)
  
  const [admin, setAdmin] = useState(null);


  const handleAdminDetails = async () => {
    try {
      // Fetch the specific apartment details
      const result = await fetch(`${url}/${id}`, auth.accessToken);
        setAdmin(result.data);
        console.log(result.data)
        return result.data
    } catch (error) {
      toast.error("Error fetching profile");
      // console.log("Fetch error:", error);
    }
  };
  
  
  const { data, isError, isLoading, isSuccess } = useQuery(
    ["admin"],
     handleAdminDetails,
    { keepPreviousData: true,
        staleTime: 10000,
        refetchOnMount:"always",
        onSuccess: () => {
          setTimeout(() => {
          }, 2000)
        }
    }
  );

  console.log(auth)
  return (
    <div className='py-28 md:pt-12 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 h-dvh overflow-y-auto transition-colors duration-300'>
      <ToastContainer />
      <div className='my-8'>
        <Link to='/admin' className='inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'>
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 28 28"
          className='h-6 w-6'
          fill="currentColor">
          <path d="M0 0h24v24H0V0z"  
          fill="none"/>
          <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z"/></svg>
          <span className='font-medium'>Back to Dashboard</span>
        </Link>
      </div>
      <div className='mb-6 flex justify-end'>
        <Link to='/admin/change-password' className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm'>
          <span>Change Password</span>
        </Link>
      </div>
      {isLoading && <div className='flex justify-center items-center py-12'>
        <CircularProgress className='text-blue-600 dark:text-blue-400' />
      </div>}
      {isError && <div className='flex justify-center items-center py-12'>
        <p className='text-red-500 dark:text-red-400 text-lg'>Error fetching admin's details</p>
      </div>}
      {
        isSuccess && 
        <div>
          <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">Profile Details</h2>
          <div className='flex flex-col items-center gap-6 border-b border-gray-200 dark:border-gray-700 py-8'>
            <div className='bg-gradient-to-br from-blue-500 to-blue-600 w-52 h-52 rounded-full flex justify-center items-center relative shadow-xl border-4 border-white dark:border-gray-700'>
              {
                admin?.profile ? <img src={admin?.profile} alt="profile" className='w-full h-full rounded-full object-cover' /> : <span className='text-8xl font-bold text-white tracking-tighter -mt-6'>{admin?.firstname?.slice(0, 1)}</span>
              }
              <button 
                className='bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-3 rounded-full absolute right-2 bottom-2 shadow-lg transition-colors duration-200'
                onClick={handleOpenUpload}
              >
                <PhotoCamera className='text-gray-700 dark:text-gray-300 w-5 h-5' />
              </button>
            <div className='absolute -bottom-2'>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                admin?.isVerified 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {admin?.isVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            </div>
            <div className="text-center">
            <h3 className="text-gray-800 dark:text-white font-bold text-3xl mb-2">{`${admin?.firstname} ${admin?.lastname}` || "N/A"} </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{admin?.email || "N/A"}</p>
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">Username</span>
              <p className="text-gray-800 dark:text-white text-lg font-medium mt-1">{admin?.username || "N/A"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">Phone</span>
              <p className="text-gray-800 dark:text-white text-lg font-medium mt-1">{admin?.phone || "N/A"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">Status</span>
              <p className={`text-lg font-semibold mt-1 ${
                admin?.isActive ? "text-green-500" : "text-red-500"
              }`}>
                {admin?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">Role</span>
              <p className="text-gray-800 dark:text-white text-lg font-medium mt-1">Administrator</p>
            </div>
          </div>
        </div>
        </div>
      }
      <div className='flex justify-end py-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm'
        onClick={() => {
          handleUpdateOpen()
          setAdmin(admin)
        }}>Update Profile</button>
      </div>
      {/* <UpdateProfile open={openUpdate} handleClose={handleUpdateClose} admin={admin} /> */}
      <UploadProfile open={openUpload} handleClose={handleCloseUpload} userId={id}/>
    </div>
  )
}

export default AdminProfile
