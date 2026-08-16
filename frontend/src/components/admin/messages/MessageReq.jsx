import React, { useState } from 'react';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Mail, Visibility, Delete, ArrowBack } from '@mui/icons-material';
import DeleteQuery from '../actionQuery/DeleteQuery'

const MessageReq = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const url = `${baseURL}messagereq`;
  const navigate = useNavigate();

  // Delete state
  const [item, setItem] = useState("");
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
    const result = await fetch(url, auth.accessToken);
    // console.log(result);
    return result.data;
  };

  const { data, isError, isLoading, isSuccess } = useQuery(
    ["messages"],
    getMessages,
    {
      keepPreviousData: true,
      staleTime: 10000,
      refetchOnMount: "always",
    }
  );

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Message Requests</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Review and manage customer inquiries</p>
      </div>

      {/* Content */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customer Messages</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage incoming customer inquiries</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-20">
            <CircularProgress />
          </div>
        )}
        
        {/* Error State */}
        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error loading messages</p>
          </div>
        )}
        
        {/* Messages Grid */}
        {isSuccess && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data?.messages?.length > 0 ? (
              data.messages.map((message) => (
                <div key={message._id} className='card p-6 hover:shadow-lg transition-all duration-300'>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{message.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                      {message.message.slice(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenMessage(message)}
                      className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2"
                    >
                      <Visibility className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => { handleOpenDel(); setItem(message._id); }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Delete Message"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Messages</h3>
                <p className="text-gray-600 dark:text-gray-400">No customer messages at this time</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowBack className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Delete Message Modal */}
      <DeleteQuery open={openDel} handleClose={handleCloseDel} delId={item} url={url} />

      {/* Message Viewing Modal */}
      <Dialog 
        open={openMessageModal} 
        onClose={handleCloseMessage} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          className: "dark:bg-gray-800"
        }}
      >
        <DialogTitle className="dark:text-white border-b border-gray-200 dark:border-gray-700">
          Message Details
        </DialogTitle>
        <DialogContent className="dark:text-gray-300 mt-4">
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">From:</span>
                <span className="ml-2">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Email:</span>
                <span className="ml-2">{selectedMessage.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Phone:</span>
                <span className="ml-2">{selectedMessage.phone}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Message:</span>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="border-t border-gray-200 dark:border-gray-700">
          <Button onClick={handleCloseMessage} className="dark:text-blue-400">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MessageReq;
