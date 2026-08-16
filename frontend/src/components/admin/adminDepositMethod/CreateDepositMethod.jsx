import { useState } from 'react'
import usePost from "../../../hooks/usePost";
import useAuth from "../../../hooks/useAuth";
import baseURL from '../../../shared/baseURL';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "react-query";
import { CircularProgress } from '@mui/material';
import { Close, Add, AccountBalance, CloudUpload } from '@mui/icons-material';
import axios from 'axios';

const CreateDepositMethod = ({ open, handleClose }) => {
  const queryClient = useQueryClient();
  const post = usePost();
  const { auth } = useAuth();
  const url = `${baseURL}depositmethod`;
  const [isLoading, setIsLoading] = useState(false);
  const [qrPreview, setQrPreview] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "all" });

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setQrPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(file.name, file);
      const res = await axios.post(`${baseURL}upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth.accessToken}` }
      });
      setQrUrl(res.data.url);
      toast.success('QR code uploaded');
    } catch (e) {
      toast.error('QR upload failed');
    } finally {
      setUploading(false);
    }
  };

  const createMethod = async (data) => {
    setIsLoading(true);
    try {
      await post(url, { ...data, qrCode: qrUrl || undefined }, auth?.accessToken);
      queryClient.invalidateQueries('depositmethods');
      toast.success('Deposit Method Created Successfully');
      reset();
      setQrPreview(null);
      setQrUrl('');
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { mutate } = useMutation(createMethod);

  return (
    <Modal open={open} onClose={handleClose} className="flex items-center justify-center p-4">
      <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md max-h-[90vh] overflow-hidden">
        <ToastContainer />
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AccountBalance className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Create Deposit Method</h3>
              <p className="text-blue-100 text-sm">Add new payment method for deposits</p>
            </div>
          </div>
          <button type="button" onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200">
            <Close className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Method Name</label>
              <input type="text" {...register("name", { required: "Method name is required" })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                placeholder="e.g., Bitcoin, USDT TRC20" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Type</label>
              <select {...register("type")}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                <option value="crypto">Crypto</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Payment Address / Account Details</label>
              <input type="text" {...register("value", { required: "Payment address is required" })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                placeholder="Enter wallet address or account details" />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</label>
              <textarea rows={3} {...register("description")}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                placeholder="Instructions for users" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Min. Amount ($)</label>
                <input type="number" min="0" step="0.01" {...register("minAmount", { required: "Required" })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" placeholder="0.00" />
                {errors.minAmount && <p className="mt-1 text-sm text-red-600">{errors.minAmount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Max. Amount ($)</label>
                <input type="number" min="0" step="0.01" {...register("maxAmount", { required: "Required" })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" placeholder="0.00" />
                {errors.maxAmount && <p className="mt-1 text-sm text-red-600">{errors.maxAmount.message}</p>}
              </div>
            </div>

            {/* QR Code Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">QR Code (optional)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
                {qrPreview
                  ? <img src={qrPreview} alt="QR Preview" className="h-full w-full object-contain p-2" />
                  : <div className="flex flex-col items-center gap-1 text-gray-400">
                      <CloudUpload />
                      <span className="text-xs">{uploading ? 'Uploading...' : 'Click to upload QR code'}</span>
                    </div>
                }
                {uploading && <div className="absolute inset-0 bg-white/60 dark:bg-black/40 flex items-center justify-center"><CircularProgress size={24} /></div>}
                <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} disabled={uploading} />
              </label>
              {qrUrl && <p className="mt-1 text-xs text-green-600 dark:text-green-400 truncate">✓ Uploaded</p>}
            </div>

            <button type="submit" disabled={isLoading || uploading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-lg font-semibold transition-all duration-200">
              {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><Add className="w-5 h-5" /> Create Deposit Method</>}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateDepositMethod;
