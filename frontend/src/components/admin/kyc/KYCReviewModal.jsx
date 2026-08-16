import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CheckCircle, Cancel, Close } from '@mui/icons-material';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import axios from 'axios';

const KYCReviewModal = ({ open, onClose, kycId, onSuccess }) => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const queryClient = useQueryClient();
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (open && kycId) {
      fetchKYCDetails();
    }
  }, [open, kycId]);

  const fetchKYCDetails = async () => {
    setFetchLoading(true);
    try {
      const result = await fetch(`${baseURL}kyc/${kycId}`, auth.accessToken);
      setSelectedKYC(result.data);
      setNotes(result.data?.adminNotes || '');
    } catch (error) {
      toast.error('Error fetching KYC details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axios.put(`${baseURL}kyc/approve/${kycId}`, {
        adminId: auth?.user._id,
        notes
      }, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      
      toast.success('KYC approved successfully!');
      queryClient.invalidateQueries(['pending-kycs']);
      queryClient.invalidateQueries(['all-kycs']);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving KYC');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${baseURL}kyc/reject/${kycId}`, {
        adminId: auth?.user._id,
        notes
      }, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      
      toast.success('KYC rejected successfully!');
      queryClient.invalidateQueries(['pending-kycs']);
      queryClient.invalidateQueries(['all-kycs']);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting KYC');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedKYC(null);
    setNotes('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        className: "dark:bg-gray-800 dark:text-white"
      }}
    >
      <DialogTitle className="flex items-center justify-between dark:bg-gray-800 dark:text-white">
        <span>Review KYC - {selectedKYC?.userId.firstname} {selectedKYC?.userId.lastname}</span>
        <button onClick={handleClose} className="dark:text-gray-300 hover:dark:text-white">
          <Close className="w-6 h-6" />
        </button>
      </DialogTitle>
      <DialogContent className="dark:bg-gray-800">
        {fetchLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : selectedKYC ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Type</p>
                <p className="text-gray-900 dark:text-white">{selectedKYC.documentType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Number</p>
                <p className="text-gray-900 dark:text-white">{selectedKYC.documentNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-gray-900 dark:text-white">{selectedKYC.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedKYC.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-gray-900 dark:text-white">{selectedKYC.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-gray-900 dark:text-white">{selectedKYC.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Document Image</h4>
                <img
                  src={selectedKYC.documentImage}
                  alt="Document"
                  className="w-full rounded-lg shadow"
                />
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Selfie Image</h4>
                <img
                  src={selectedKYC.selfieImage}
                  alt="Selfie"
                  className="w-full rounded-lg shadow"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Admin Notes {selectedKYC.status === 'pending' && '(Required for rejection)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Add notes about the review..."
                disabled={selectedKYC.status !== 'pending'}
              />
            </div>

            {selectedKYC.status === 'pending' && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <Cancel className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Approve'}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default KYCReviewModal;