import useDelete from "../../hooks/useDelete";
import useAuth from "../../hooks/useAuth";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import {CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DeleteNotification = ({ open, handleClose, delId, url}) => {
  const { auth } = useAuth();
  const deleteUser = useDelete();
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteNotif = async () => {
    setIsLoading(true)
    if (!auth || !auth.accessToken) {
      toast.error("You are not authorized to perform this action");
      navigate("/auth/user/login");
      return;
    }

    try {
      const response = await deleteUser(`${url}/${delId}`, auth.accessToken);
      if (response.status === 200 ) {
        toast.success("Delete successfully");
        queryClient.invalidateQueries('inappmessages');
        setTimeout(() => {
          handleClose();
        }, 1000);
        setIsLoading(false)
      } else {
        setIsLoading(false)
        toast.error("Failed to delete");
      }
      // console.log(response);
      
    } catch (error) {
      toast.error("Failed to delete");
    }
  };
  // console.log(delId);
  return (
    <Modal 
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
   >
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Notification
            </h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteNotif}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} style={{color: 'white'}} />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
  )
}

export default DeleteNotification
