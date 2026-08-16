
import useDelete from "../../../hooks/useDelete";
import useAuth from "../../../hooks/useAuth";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import {CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DeleteDepositMethod = ({ open, handleClose, methodId, url}) => {
  const { auth } = useAuth();
  const deleteData = useDelete();
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  // console.log(url)
  const deleteDepositMethod = async () => {
    setIsLoading(true)
    if (!auth || !auth.accessToken) {
      toast.error("You are not authorized to perform this action");
      navigate("/login");
      return;
    }

    try {
      const response = await deleteData(`${url}/${methodId}`, auth.accessToken);
      if (response.status === 200 ) {
        toast.success("Deposit Method deleted successfully");
        queryClient.invalidateQueries("depositMethods");
        setTimeout(() => {
          handleClose();
          navigate("/admin/depositmethods");
        }, 1000);
        setIsLoading(false)
      } else {
        setIsLoading(false)
        toast.error("Failed to delete deposit method");
      }
      // console.log(response);
      
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to delete depositmethod");
    }
  };
  // console.log(userId);
  return (
    <Modal 
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
   >
    <div>
      <div
        id="deleteModal"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-md bg-white rounded-lg shadow-lg"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Delete Deposit Method
          </h3>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this deposit method? This action cannot be undone.
          </p>
            <div className="flex justify-center gap-4">
              <button
                className=" bg-red-600 px-2 rounded-lg text-white"
                onClick={deleteDepositMethod}
              >
                {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : 'Delete'}
              </button>
              <button
                className=" bg-gray-300 px-2 rounded-lg text-gray-800"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
        </div>
      </div>
    </div>
  </Modal>
  )
}

export default DeleteDepositMethod
