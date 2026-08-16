import React, { useEffect, useState } from 'react'
import baseURL from '../../shared/baseURL'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { CircularProgress, Modal } from '@mui/material'
import { Close, CloudUpload, PhotoCamera } from '@mui/icons-material'

const UploadProfile = ({userId, open, handleClose}) => {
    const [error, setError] = useState('')
    const [preview, setPreview] = useState(null)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { auth } = useAuth()
    const url = `${baseURL}user/profile`
    const [isLoading, setIsLoading] = useState(false)

    const { 
      register, 
      handleSubmit,
      setValue,
      watch,
      formState: { errors } 
    } = useForm()

    const watchFiles = watch('files')

    useEffect(() => {
      if (watchFiles && watchFiles[0]) {
        const file = watchFiles[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }, [watchFiles])

    const uploadImage = async (data) => {
      setIsLoading(true)
      const files = data.files
      const formData = new FormData()
      for (const key of files) {
        formData.append(key.name, key);
      }

      try {
        const response = await axios.put(`${url}/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        })
        return response.data
      } catch (error) {
        throw error
      }
    }

    const {mutate} = useMutation(uploadImage, {
      onSuccess: () => {
        queryClient.invalidateQueries('user')
        queryClient.invalidateQueries('admin')
        queryClient.invalidateQueries('client')
        setTimeout(() => {
          toast.success('Profile Picture uploaded successfully')
          handleClose()
          setIsLoading(false)
          setPreview(null)
        }, 1000)
      },
      onError: (error) => {
        setIsLoading(false)
        setError(error.response?.data?.error || error.message)
      }
    })

    const onSubmit = (data) => {
      mutate(data)
    }

    const handleCloseModal = () => {
      setPreview(null)
      handleClose()
    }

    return (
      <Modal
        open={open}
        onClose={handleCloseModal}
        className="flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <PhotoCamera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Upload Profile Picture</h3>
                <p className="text-blue-100 text-sm">Choose a new profile image</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isLoading}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <Close className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Preview Section */}
              {preview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-800"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <PhotoCamera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  id="files"
                  name="files"
                  accept="image/*"
                  {...register('files', { required: "Please select an image" })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                  preview 
                    ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}>
                  <CloudUpload className={`w-12 h-12 mx-auto mb-4 ${
                    preview ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {preview ? 'Image Selected' : 'Click to upload image'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {errors.files && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.files.message}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || !preview}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <CircularProgress size={20} style={{color: 'white'}} />
                  ) : (
                    <>
                      <CloudUpload className="w-5 h-5" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    )
}

export default UploadProfile