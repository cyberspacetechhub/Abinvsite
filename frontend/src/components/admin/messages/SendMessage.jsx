
import React, {useState} from 'react'
import usePost from '../../../hooks/usePost'
import useFetch from '../../../hooks/useFetch'
import { useForm } from 'react-hook-form'
import { Modal } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import baseURL from '../../../shared/baseURL'
import { useQueryClient, useMutation } from 'react-query'
import {CircularProgress} from '@mui/material'
import useAuth from '../../../hooks/useAuth'

const SendMessage = ({open, handleClose, userId}) => {
  const url = `${baseURL}inappmessage`
  const post = usePost()
  const {data: users} = useFetch(`${baseURL}client`)
  const {register, handleSubmit, reset, setError} = useForm()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { auth } = useAuth()

  const sendMessage = async(data) => {
    setLoading(true)

    const formData = new FormData();
  
    // Append form fields
    for ( const key in data) {
      formData.append(key, data[key]);
    }
  
    // Log the FormData contents
    for (let [key, value] of formData.entries()) {
      // console.log(`${key}: ${value}`);
    }

    try {
      const response = await post(url, formData)
      if (response.status === 200) {
        toast.success('Message sent successfully')
        // setTimeout(() => {
        //   reset()
        //   handleClose()
        // }, 3000)
      }
    } catch (error) {
      toast.error('Error sending message')
      // console.log(error)
    }
  }
  
  const { mutate } = useMutation(sendMessage, {
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries('messages')
        reset()
        handleClose()
        setLoading(false)
      }, 3000)
    }
  })

  const handleSendMessage = (data) => {
    mutate(data)
  }

  return (
    <Modal open={open} onClose={handleClose}>
       <div
    id="defaultModal"
    className=" overflow-y-auto overflow-x-hidden absolute top-10  z-50 justify-center items-center w-full outline-none "
  >
    <ToastContainer />
    <div className="flex flex-col items-center justify-center px-6 mx-auto lg:py-0 h-dvh">
      {/* <!-- Modal content --> */}
      <div className="relative w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 overflow-y-auto max-h-screen pb-3">
        {/* <!-- Modal header --> */}
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-2xl font-bold">Send Message</h1>
        <button
          type="button"
          onClick={() => {handleClose()}}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-1.5 ml-auto inline-flex items-center absolute border border-gray-800 right-3 top-0"
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
        <form onSubmit={handleSubmit(handleSendMessage)} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            {/* <label htmlFor="receiver">Receiver</label> */}
            <input type="hidden" value={userId} {...register('receiver')} className="border border-gray-300 p-2 rounded-md">
              {/* <option value="">Select Receiver</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))} */}
            </input>
          </div>
          <div className="flex flex-col gap-2">
            {/* <label htmlFor="subject">Sender</label> */}
            <input type="hidden" value={auth?.user?._id} {...register('sender')} className="border border-gray-300 p-2 rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subject">Subject</label>
            <input type="text" {...register('subject')} className="border border-gray-300 p-2 rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message">Message</label>
            <textarea {...register('message')} className="border border-gray-300 p-2 rounded-md" />
          </div>
          <button type="submit" className="bg-primary text-white p-2 rounded-md">
            {loading ? <CircularProgress size={20} /> : 'Send'}
          </button>
        </form>
      </div>
      </div>
      </div>
      </div>
    </Modal>
  )
}

export default SendMessage