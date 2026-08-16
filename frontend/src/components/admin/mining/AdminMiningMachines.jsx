import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { Diamond, Add, Edit, Delete, Close, CheckCircle, CloudUpload } from '@mui/icons-material'
import Modal from '@mui/material/Modal'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import baseURL from '../../../shared/baseURL'
import axios from 'axios'

const MachineForm = ({ open, handleClose, existing }) => {
  const { auth } = useAuth()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    values: existing || {}
  })
  const [loading, setLoading] = useState(false)
  const [imgPreview, setImgPreview] = useState(existing?.image || null)
  const [imgUrl, setImgUrl] = useState(existing?.image || '')
  const [uploading, setUploading] = useState(false)

  const handleImgUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append(file.name, file)
      const res = await axios.post(`${baseURL}upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth.accessToken}` }
      })
      setImgUrl(res.data.url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (data) => {
    setLoading(true)
    try {
      const payload = { ...data, price: Number(data.price), dailyRate: Number(data.dailyRate), image: imgUrl || data.image || undefined }
      if (existing) {
        await axios.put(`${baseURL}mining-machines/${existing._id}`, payload, {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        })
        toast.success('Rig updated')
      } else {
        await axios.post(`${baseURL}mining-machines`, payload, {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        })
        toast.success('Rig created')
      }
      queryClient.invalidateQueries('admin-mining-machines')
      reset()
      handleClose()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} className="flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-yellow-600 to-amber-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-white">{existing ? 'Edit Rig' : 'Create Rig'}</h3>
          <button onClick={handleClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center">
            <Close className="text-white" fontSize="small" />
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
          {[
            { name: 'machineId', label: 'Rig ID', placeholder: 'e.g. rig-s1', disabled: !!existing },
            { name: 'name', label: 'Name', placeholder: 'e.g. Gold Rig S1' },
            { name: 'hashrate', label: 'Mining Rate', placeholder: 'e.g. 10 oz/day' },
            { name: 'description', label: 'Description', placeholder: 'Short description', required: false },
          ].map(({ name, label, placeholder, disabled, required = true }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">{label}</label>
              <input
                type="text"
                disabled={disabled}
                {...register(name, required ? { required: `${label} is required` } : {})}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              />
              {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[{ name: 'price', label: 'Price ($)' }, { name: 'dailyRate', label: 'Daily Rate ($)' }].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">{label}</label>
                <input
                  type="number" step="0.01" min="0"
                  {...register(name, { required: `${label} is required` })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 accent-amber-600" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active (visible to clients)</label>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Rig Image (optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-amber-400 transition-colors bg-gray-50 dark:bg-gray-700 relative overflow-hidden">
              {imgPreview
                ? <img src={imgPreview} alt="Preview" className="h-full w-full object-contain p-2" />
                : <div className="flex flex-col items-center gap-1 text-gray-400">
                    <CloudUpload fontSize="small" />
                    <span className="text-xs">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                  </div>
              }
              {uploading && <div className="absolute inset-0 bg-white/60 dark:bg-black/40 flex items-center justify-center"><CircularProgress size={20} /></div>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImgUpload} disabled={uploading} />
            </label>
            {imgUrl && <p className="mt-1 text-xs text-green-600 dark:text-green-400">✓ Image ready</p>}
          </div>

          <button
            type="submit" disabled={loading || uploading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {loading ? <CircularProgress size={18} style={{ color: 'white' }} /> : <><CheckCircle fontSize="small" /> {existing ? 'Save Changes' : 'Create Rig'}</>}
          </button>
        </form>
      </div>
    </Modal>
  )
}

const AdminMiningMachines = () => {
  const fetch = useFetch()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { data, isLoading, isError } = useQuery(
    'admin-mining-machines',
    async () => {
      const res = await fetch(`${baseURL}mining-machines`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const { mutate: doDelete, isLoading: deleteLoading } = useMutation(
    async (id) => {
      await axios.delete(`${baseURL}mining-machines/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      })
    },
    {
      onSuccess: () => {
        toast.success('Rig deleted')
        queryClient.invalidateQueries('admin-mining-machines')
        setDeleting(null)
      },
      onError: (e) => toast.error(e?.response?.data?.message || 'Delete failed')
    }
  )

  const machines = data?.machines || []

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gold Mining Rigs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage the gold mining rig catalog available to clients</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Diamond className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Rig Catalog</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{machines.length} rig{machines.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <Add fontSize="small" /> Add Rig
        </button>
      </div>

      {isLoading && <div className="flex justify-center p-20"><CircularProgress /></div>}
      {isError && <p className="text-red-500 text-center py-8">Error loading machines</p>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {machines.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Diamond className="text-gray-300 dark:text-gray-600 mx-auto mb-4" style={{ fontSize: 56 }} />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No rigs yet. Add your first one.</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">Add Rig</button>
            </div>
          ) : machines.map((m) => (
            <div key={m._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{m.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{m.machineId}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${m.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {m.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-1.5 mb-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Mining Rate</span><span className="font-medium text-gray-900 dark:text-white">{m.hashrate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-bold text-gray-900 dark:text-white">${m.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Daily Rate</span><span className="font-semibold text-emerald-600 dark:text-emerald-400">${m.dailyRate}/day</span></div>
              </div>
              {m.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{m.description}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(m); setShowForm(true) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  <Edit fontSize="small" /> Edit
                </button>
                <button
                  onClick={() => setDeleting(m._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Delete fontSize="small" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Rig?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This removes the rig from the catalog. Clients who already own it are unaffected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 btn-secondary">Cancel</button>
              <button
                onClick={() => doDelete(deleting)}
                disabled={deleteLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                {deleteLoading ? <CircularProgress size={16} style={{ color: 'white' }} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <MachineForm open={showForm} handleClose={() => { setShowForm(false); setEditing(null) }} existing={editing} />
    </div>
  )
}

export default AdminMiningMachines
