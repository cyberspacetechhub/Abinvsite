import useDelete from "../../../hooks/useDelete";
import useAuth from "../../../hooks/useAuth";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import {CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Warning, Delete, Close } from "@mui/icons-material";

const DeleteQuery = ({ open, handleClose, delId, url}) => {
  const { auth } = useAuth();
  const deleteUser = useDelete();
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteUser = async () => {
    setIsLoading(true)
    if (!auth || !auth.accessToken) {
      toast.error("You are not authorized to perform this action");
      navigate("/auth.admim.login");
      return;
    }

    try {
      const response = await deleteUser(`${url}/${delId}`, auth.accessToken);
      if (response.status === 200 ) {
        toast.success("Delete successfully");
        queryClient.invalidateQueries('transactions');
        queryClient.invalidateQueries('withdrawals');
        queryClient.invalidateQueries('deposits');
        queryClient.invalidateQueries('investments');
        queryClient.invalidateQueries('messages');
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
      className="flex items-center justify-center p-4"
    >
      <div className="card max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Warning className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Delete className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Are you sure you want to delete this item?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              This action is permanent and cannot be undone. All associated data will be permanently removed.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} style={{color: 'white'}} />
                  Deleting...
                </>
              ) : (
                <>
                  <Delete className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteQuery
