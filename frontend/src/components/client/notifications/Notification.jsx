import React, { useState } from 'react';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { RefreshOutlined } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import DeleteNotification from '../../utils/DeleteNotification';

const Notification = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const url = `${baseURL}inappmessage/receiver`;
  const deleteUrl = `${baseURL}inappmessage`;
  const navigate = useNavigate()
  const id = auth?.user?._id;
  // Delete state
  const [notif, setNotif] = useState("");
  const [openDel, setOpenDel] = useState(false);
  const handleOpenDel = () => setOpenDel(true);
  const handleCloseDel = () => setOpenDel(false);

  // Modal state for viewing messages
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setOpenMessageModal(true);
  };
  const handleCloseMessage = () => setOpenMessageModal(false);

  const getMessages = async () => {
    const result = await fetch(`${url}/${id}`, auth.accessToken);
    // console.log(result)
    return result.data;
  };

  const { data, isError, isLoading, isSuccess } = useQuery(
    ["inappmessages"],
    getMessages,
    {
      keepPreviousData: true,
      staleTime: 10000,
      refetchOnMount: "always",
    }
  );

  const markAllAsRead = async() => {
    try {
      const response = await axios.put(`${baseURL}inappmessage/markall/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
        },
      });
    //   console.log(response.data);
    toast.success(response.data.message);
    } catch (error) {
    //   console.error('Error marking all messages as read:', error);
      toast.error('Error marking all messages as read');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-8 pt-20 px-4 md:px-8'>
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className='font-medium'>Back</span>
          </button>
          
          <button 
            onClick={() => {markAllAsRead()}} 
            className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200'
          >
            <RefreshOutlined className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
        
        <div className="text-center">
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-2'>Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with your latest messages and alerts</p>
        </div>
      </div>
      <div className='mt-10'>
        {isLoading && (
          <div className='flex flex-col items-center justify-center py-20'>
            <CircularProgress className="text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading notifications...</p>
          </div>
        )}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 text-lg">Error loading notifications</p>
          </div>
        )}
        
        {isSuccess && (
          <div className='space-y-4'>
            {data?.result?.length > 0 ? (
              data.result.map((message) => (
                <div key={message._id} className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200'>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-800 dark:text-white'>Stock Exchange Mining Platform</h3>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>{new Date(message.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <h4 className='font-medium text-gray-800 dark:text-white mb-2'>{message.subject}</h4>
                      <p className='text-gray-600 dark:text-gray-400 mb-4'>
                        {message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}
                      </p>
                      
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleOpenMessage(message)}
                          className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200'
                        >
                          Read More
                        </button>
                        <button
                          onClick={() => { handleOpenDel(); setNotif(message._id); }}
                          className='text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-400">You're all caught up! Check back later for new updates.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Message Modal */}
      {/* <DelPaymentAccount open={openDel} handleClose={handleCloseDel} accountId={account} url={url} /> */}

      {/* Message Viewing Modal */}
      <Dialog 
        open={openMessageModal} 
        onClose={handleCloseMessage} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: 'bg-white dark:bg-gray-800 rounded-2xl'
        }}
      >
        <div className='bg-white dark:bg-gray-800'>
          <DialogTitle className='text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700'>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Message Details</span>
            </div>
          </DialogTitle>
          <DialogContent className='p-6'>
            {selectedMessage && (
              <div className='space-y-4'>
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>From</p>
                  <p className='font-medium text-gray-800 dark:text-white'>Stock Exchange Mining Platform</p>
                </div>
                
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Subject</p>
                  <p className='font-medium text-gray-800 dark:text-white'>{selectedMessage.subject}</p>
                </div>
                
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Message</p>
                  <p className='text-gray-800 dark:text-white leading-relaxed'>{selectedMessage.message}</p>
                </div>
                
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Date</p>
                  <p className='font-medium text-gray-800 dark:text-white'>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions className='p-6 border-t border-gray-200 dark:border-gray-700'>
            <Button 
              onClick={handleCloseMessage} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      <DeleteNotification
        open={openDel}
        handleClose={handleCloseDel}
        delId={notif}
        url={deleteUrl}
    />
    </div>
  );
};

export default Notification;
