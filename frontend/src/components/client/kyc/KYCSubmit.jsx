import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { CloudUpload, Person, CreditCard } from '@mui/icons-material';
import useAuth from '../../../hooks/useAuth';
import baseURL from '../../../shared/baseURL';
import axios from 'axios';

const KYCSubmit = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    country: ''
  });
  const [files, setFiles] = useState({
    documentImage: null,
    selfieImage: null
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: selectedFiles[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.documentImage || !files.selfieImage) {
      toast.error('Please upload both document and selfie images');
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    submitData.append('documentImage', files.documentImage);
    submitData.append('selfieImage', files.selfieImage);
    console.log(auth)
    try {
      const response = await axios.post(`${baseURL}kyc/submit/${auth?.user._id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        toast.success('KYC submitted successfully!');
        setTimeout(() => navigate('/user/kyc/status'), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting KYC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 md:ml-8">
      <ToastContainer />
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/user/kyc/status" className="flex items-center gap-2 btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to KYC Status
          </Link>
        </div>

        <div className="p-8 card-elevated">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Submit KYC Documents</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Type *
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Document Type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Number *
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter document number"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Full name as on document"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Country of residence"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Full residential address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CreditCard className="inline w-4 h-4 mr-1" />
                  Document Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="documentImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <CloudUpload className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <p className="mt-1 text-xs text-gray-500">Clear photo of your ID document</p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Person className="inline w-4 h-4 mr-1" />
                  Selfie with Document *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="selfieImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <CloudUpload className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <p className="mt-1 text-xs text-gray-500">Photo of yourself holding the document</p>
              </div>
            </div>

            <div className="p-4 text-blue-800 bg-blue-100 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
              <h4 className="font-semibold">Important Guidelines:</h4>
              <ul className="mt-2 text-sm list-disc list-inside">
                <li>Ensure all document details are clearly visible</li>
                <li>Photos should be well-lit and in focus</li>
                <li>Maximum file size: 10MB per image</li>
                <li>Accepted formats: JPG, PNG, WebP</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} />
                    Submitting...
                  </>
                ) : (
                  'Submit KYC'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCSubmit;