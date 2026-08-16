import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { isError } from 'react-query'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import { useParams } from 'react-router-dom'
import CreateWithdrawal from './CreateWithdrawal'

const WithdrawalMethodDetails = () => {
  const fetch = useFetch()
  const auth = useAuth()
  const url = `${baseURL}withdrawalmethod`
  const { id } = useParams()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const [method, setMethod] = useState(null)
  const [methodId, setMethodId] = useState(null)

  const fetchWithdrawalMethod = async () => {
      const result = await fetch(`${url}/${id}`, auth.accessToken);
      // console.log(result)
      setMethod(result.data);
      return result.data;
    };
  
    const { data, isError, isLoading, isSuccess } = useQuery(
      ["withdrawalMethod"],
       fetchWithdrawalMethod,
      { keepPreviousData: true,
          staleTime: 10000,
          refetchOnMount:"always",
          onSuccess: () => {
            setTimeout(() => {
            }, 2000)
          }
      }
    );
  return (
    <div className='pt-20 h-dvh px-10 md:px-20 bg-white dark:bg-gray-900'>
        <Link to="/user/withdrawalmethod" className='px-4 py-1 text-sm font-medium text-green-100 '>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 28 28"
          className=' h-7 w-7 text-gray-700 dark:text-gray-400 hover:text-green-600'
          fill="currentColor">
          <path d="M0 0h24v24H0V0z" 
          fill="none"/>
          <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z"/>
        </svg>
        </Link>
      <div className='py-5'>
        <h2 className='font-semibold text-2xl text-gray-700 dark:text-gray-300'>Withdrawal Method Details</h2>
      </div>
      {isLoading && <p>{<CircularProgress />}</p> }
      {isError && <p>Error Fetching data</p> }
      {
        isSuccess && 
        <div className="flex flex-col justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        {/* Left Section with Icon and Text */}
        <div className="flex flex-col justify-center">
            {/* Icon */}
            <div className="flex items-center justify-center self-center w-12 h-12 bg-black rounded-full">
              <span className="text-yellow-500 text-2xl">⬛</span>
            </div>
            {/* Text Content */}
            <div className="">
            <h3 className="text-lg font-bold text-center text-gray-700 dark:text-gray-300">{method?.name ? method.name : 'N/A'}</h3>
            {/* <p className="text-sm text-gray-600 font-semibold flex flex-col">Address: <span className='font-normal'>{method?.value ? method.value : 'N/A'}</span></p> */}
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold pt-4">Limits:
              <p className='flex flex-col gap-2 pt-2 text-gray-700 dark:text-gray-300'>
                <span>Min. Amount: {method?.minAmount?.toLocaleString()} USD</span>
                <span>Max. Amount: {method?.maxAmount?.toLocaleString()} USD</span>
              </p>
            </div>
            </div>
        </div>
        <div className='pt-4'>
          <h2 className='font-semibold text-gray-600 dark:text-gray-400'>Description:</h2>
          <p className='text-gray-700 dark:text-gray-300'>{method?.description ? method.description : 'N/A'}</p>
        </div>
          
      </div>
      
      }
      <div className='self-end mt-8 flex gap-2 items-center'>
        <button 
          onClick={() => {
            handleOpenModal()
            setMethodId(method._id)
          }}
          className=' px-4 py-1 text-sm font-medium text-cyan-100 bg-cyan-600 rounded-lg'>
            <span className="">
                Proceed
            </span>
        </button>
        </div>
      <div>
        <CreateWithdrawal
          open={openModal}
          handleClose={handleCloseModal}
          methodId={methodId}
        />
      </div>
    </div>
  )
}

export default WithdrawalMethodDetails
