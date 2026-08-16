import { useState, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { Add, Delete, Star, StarBorder, ArrowBack, AccountBalance, CurrencyBitcoin, Close, CheckCircle } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Modal from '@mui/material/Modal'
import { useForm } from 'react-hook-form'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import axios from 'axios'

const AddAccountModal = ({ open, handleClose, userId, onSuccess }) => {
  const { auth } = useContext(AuthContext)
  const post = usePost()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: { type: 'crypto' } })
  const type = watch('type')

  const submit = async (data) => {
    setLoading(true)
    try {
      await post(`${baseURL}withdrawal-account/${userId}`, data, auth.accessToken)
      toast.success('Account added')
      reset()
      onSuccess()
      handleClose()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to add account')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <Modal open={open} onClose={handleClose} className="flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-white">Add Withdrawal Account</h3>
          <button onClick={handleClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center">
            <Close className="text-white" fontSize="small" />
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Account Type</label>
            <select {...register('type')} className={inputClass}>
              <option value="crypto">Crypto Wallet</option>
              <option value="bank">Bank Account</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Label</label>
            <input type="text" {...register('label', { required: 'Label is required' })}
              placeholder={type === 'crypto' ? 'e.g. My USDT Wallet' : 'e.g. Barclays Account'}
              className={inputClass} />
            {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>}
          </div>

          {type === 'crypto' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Network</label>
                <input type="text" {...register('network')} placeholder="e.g. TRC20, ERC20, BTC" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Wallet Address</label>
                <input type="text" {...register('address', { required: 'Address is required' })} placeholder="Enter wallet address" className={inputClass} />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </>
          )}

          {type === 'bank' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Bank Name</label>
                <input type="text" {...register('bankName', { required: 'Bank name is required' })} placeholder="e.g. Barclays" className={inputClass} />
                {errors.bankName && <p className="mt-1 text-xs text-red-500">{errors.bankName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Account Name</label>
                <input type="text" {...register('accountName', { required: 'Account name is required' })} placeholder="Full name on account" className={inputClass} />
                {errors.accountName && <p className="mt-1 text-xs text-red-500">{errors.accountName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Account Number</label>
                <input type="text" {...register('accountNumber', { required: 'Account number is required' })} placeholder="Account number" className={inputClass} />
                {errors.accountNumber && <p className="mt-1 text-xs text-red-500">{errors.accountNumber.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Routing Number</label>
                  <input type="text" {...register('routingNumber')} placeholder="Optional" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">SWIFT Code</label>
                  <input type="text" {...register('swiftCode')} placeholder="Optional" className={inputClass} />
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
            {loading ? <CircularProgress size={18} style={{ color: 'white' }} /> : <><CheckCircle fontSize="small" /> Save Account</>}
          </button>
        </form>
      </div>
    </Modal>
  )
}

const WithdrawalAccounts = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const _id = auth?.user?._id
  const [showAdd, setShowAdd] = useState(false)

  const { data, isLoading, isError } = useQuery(
    ['withdrawal-accounts', _id],
    async () => {
      const res = await fetch(`${baseURL}withdrawal-account/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const invalidate = () => queryClient.invalidateQueries(['withdrawal-accounts', _id])

  const { mutate: doDelete } = useMutation(
    (id) => axios.delete(`${baseURL}withdrawal-account/${_id}/${id}`, { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
    { onSuccess: () => { toast.success('Account removed'); invalidate() }, onError: () => toast.error('Failed to remove') }
  )

  const { mutate: doSetDefault } = useMutation(
    (id) => axios.put(`${baseURL}withdrawal-account/${_id}/${id}/default`, {}, { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
    { onSuccess: () => { toast.success('Default updated'); invalidate() }, onError: () => toast.error('Failed') }
  )

  const accounts = data?.accounts || []

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 transition-colors">
          <ArrowBack fontSize="small" /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Withdrawal Accounts</h1>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Manage your saved withdrawal destinations</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-display text-sm font-semibold rounded-lg transition-colors">
            <Add fontSize="small" /> Add Account
          </button>
        </div>

        {isLoading && <div className="flex justify-center py-20"><CircularProgress size={28} /></div>}
        {isError && <p className="text-center text-red-500 py-12">Failed to load accounts</p>}

        {!isLoading && !isError && (
          <div className="space-y-3">
            {accounts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <AccountBalance className="text-neutral-300 dark:text-neutral-600 mx-auto mb-3" style={{ fontSize: 48 }} />
                <p className="font-display font-semibold text-neutral-500 dark:text-neutral-400 mb-4">No accounts saved yet</p>
                <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-display text-sm font-semibold rounded-lg transition-colors">
                  Add Your First Account
                </button>
              </div>
            ) : accounts.map((acc) => (
              <div key={acc._id} className={`bg-white dark:bg-neutral-800 rounded-2xl border p-5 ${acc.isDefault ? 'border-primary-400 dark:border-primary-600' : 'border-neutral-200 dark:border-neutral-700'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${acc.type === 'crypto' ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                      {acc.type === 'crypto'
                        ? <CurrencyBitcoin className="text-amber-600 dark:text-amber-400" fontSize="small" />
                        : <AccountBalance className="text-blue-600 dark:text-blue-400" fontSize="small" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-bold text-sm text-neutral-900 dark:text-white">{acc.label}</p>
                        {acc.isDefault && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">Default</span>
                        )}
                      </div>
                      {acc.type === 'crypto' && (
                        <p className="font-mono text-xs text-neutral-400 truncate mt-0.5">{acc.network && `${acc.network} · `}{acc.address}</p>
                      )}
                      {acc.type === 'bank' && (
                        <p className="font-sans text-xs text-neutral-400 mt-0.5">{acc.bankName} · {acc.accountName} · ****{acc.accountNumber?.slice(-4)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => doSetDefault(acc._id)} title="Set as default"
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      {acc.isDefault
                        ? <Star fontSize="small" className="text-primary-500" />
                        : <StarBorder fontSize="small" className="text-neutral-400" />
                      }
                    </button>
                    <button onClick={() => doDelete(acc._id)} title="Remove"
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors">
                      <Delete fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddAccountModal open={showAdd} handleClose={() => setShowAdd(false)} userId={_id} onSuccess={invalidate} />
    </div>
  )
}

export default WithdrawalAccounts
