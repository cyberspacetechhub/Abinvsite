import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import baseURL from '../../../shared/baseURL'
import Modal from '@mui/material/Modal'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const SetWithdrawalLimit = ({ open, handleClose, userId }) => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'all' })

  const onSubmit = async ({ limit }) => {
    setIsLoading(true)
    try {
      await axiosPrivate.put(
        `${baseURL}client/withdrawal-limit/${userId}`,
        { limit: parseFloat(limit) },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      )
      queryClient.invalidateQueries('client')
      toast.success('Withdrawal limit updated successfully')
      reset()
      setTimeout(handleClose, 2000)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to set limit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        <ToastContainer />
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Set Withdrawal Limit</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Withdrawal Limit (USD) — set 0 to remove limit
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('limit', { required: 'Limit is required', min: { value: 0, message: 'Must be 0 or more' } })}
            />
            {errors.limit && <p className="mt-1 text-xs text-red-500">{errors.limit.message}</p>}
            <button
              type="submit"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              {isLoading ? <CircularProgress size={16} style={{ color: 'white' }} /> : 'Set Limit'}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default SetWithdrawalLimit
