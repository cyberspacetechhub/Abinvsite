import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { Add, Close, CheckCircle, ToggleOn, ToggleOff, Delete, Edit } from '@mui/icons-material'
import Modal from '@mui/material/Modal'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import baseURL from '../../../shared/baseURL'
import axios from 'axios'

const ACCOUNT_LABELS = { trading: 'Trading Account', mining: 'Mining Account', general: 'General' }
const STATUS_STYLES = {
    pending_payment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
}

const ServiceForm = ({ open, handleClose, existing, depositMethods, clients }) => {
    const { auth } = useAuth()
    const queryClient = useQueryClient()
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        values: existing ? {
            ...existing,
            user: existing.user?._id || existing.user,
            depositMethod: existing.depositMethod?._id || existing.depositMethod
        } : { requiresPayment: false, isActive: false, account: 'general' }
    })
    const [loading, setLoading] = useState(false)
    const requiresPayment = watch('requiresPayment')

    const submit = async (data) => {
        setLoading(true)
        try {
            const payload = {
                ...data,
                amountRequired: data.requiresPayment ? Number(data.amountRequired) : 0,
                depositMethod: data.requiresPayment ? data.depositMethod : undefined
            }
            if (existing) {
                await axios.put(`${baseURL}service-requests/${existing._id}`, payload, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                })
                toast.success('Service updated')
            } else {
                await axios.post(`${baseURL}service-requests`, payload, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                })
                toast.success('Service created')
            }
            queryClient.invalidateQueries('admin-services')
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-lg font-bold text-white">{existing ? 'Edit Service' : 'Create Service Request'}</h3>
                    <button onClick={handleClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center">
                        <Close className="text-white" fontSize="small" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
                    {/* Client */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Client</label>
                        <select {...register('user', { required: 'Client is required' })}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">-- Select Client --</option>
                            {clients.map(c => (
                                <option key={c._id} value={c._id}>{c.firstname} {c.lastname} ({c.email})</option>
                            ))}
                        </select>
                        {errors.user && <p className="mt-1 text-xs text-red-500">{errors.user.message}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Service Type</label>
                        <input type="text" {...register('type', { required: 'Type is required' })}
                            placeholder="e.g. Tax Clearance, Account Verification"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Affected Account</label>
                        <select {...register('account')}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="general">General (all accounts)</option>
                            <option value="trading">Trading Account</option>
                            <option value="mining">Mining Account</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Message to User</label>
                        <textarea rows={3} {...register('message')}
                            placeholder="Explain what the user needs to do..."
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                    </div>

                    {/* Requires Payment */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="requiresPayment" {...register('requiresPayment')} className="w-4 h-4 accent-orange-500" />
                        <label htmlFor="requiresPayment" className="text-sm text-gray-700 dark:text-gray-300">Requires Payment</label>
                    </div>

                    {requiresPayment && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Amount Required ($)</label>
                                <input type="number" step="0.01" min="0" {...register('amountRequired')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Deposit Method</label>
                                <select {...register('depositMethod')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">-- Select Method --</option>
                                    {depositMethods.map(m => (
                                        <option key={m._id} value={m._id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Active toggle */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 accent-orange-500" />
                        <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Activate immediately</label>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200">
                        {loading ? <CircularProgress size={18} style={{ color: 'white' }} /> : <><CheckCircle fontSize="small" /> {existing ? 'Save Changes' : 'Create Service'}</>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}

const AdminServiceRequests = () => {
    const fetch = useFetch()
    const { auth } = useAuth()
    const queryClient = useQueryClient()

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const { data, isLoading, isError } = useQuery('admin-services', async () => {
        const res = await fetch(`${baseURL}service-requests`, auth.accessToken)
        return res.data
    }, { staleTime: 5000, refetchOnMount: 'always' })

    const { data: clientsData } = useQuery('all-clients-service', async () => {
        const res = await fetch(`${baseURL}client?limit=200`, auth.accessToken)
        return res.data
    }, { staleTime: 30000 })

    const { data: methodsData } = useQuery('deposit-methods-service', async () => {
        const res = await fetch(`${baseURL}depositmethod`, auth.accessToken)
        return res.data
    }, { staleTime: 30000 })

    const ax = (method, url, body) => axios[method](url, body, { headers: { Authorization: `Bearer ${auth.accessToken}` } })

    const { mutate: doToggle } = useMutation(
        ({ id, isActive }) => ax('post', `${baseURL}service-requests/${id}/toggle`, { isActive }),
        { onSuccess: () => { toast.success('Updated'); queryClient.invalidateQueries('admin-services') }, onError: e => toast.error(e?.response?.data?.message || 'Failed') }
    )

    const { mutate: doResolve } = useMutation(
        (id) => ax('post', `${baseURL}service-requests/${id}/resolve`, {}),
        { onSuccess: () => { toast.success('Service resolved'); queryClient.invalidateQueries('admin-services') }, onError: e => toast.error(e?.response?.data?.message || 'Failed') }
    )

    const { mutate: doDelete, isLoading: deleteLoading } = useMutation(
        (id) => axios.delete(`${baseURL}service-requests/${id}`, { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
        { onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries('admin-services'); setDeleting(null) }, onError: e => toast.error(e?.response?.data?.message || 'Failed') }
    )

    const services = data?.services || []
    const clients = clientsData?.clients || []
    const depositMethods = methodsData?.depositMethods || []

    return (
        <div className="w-full">
            <ToastContainer />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage service requirements for client accounts</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">{services.length} service{services.length !== 1 ? 's' : ''}</p>
                <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary flex items-center gap-2">
                    <Add fontSize="small" /> New Service
                </button>
            </div>

            {isLoading && <div className="flex justify-center p-20"><CircularProgress /></div>}
            {isError && <p className="text-red-500 text-center py-8">Error loading services</p>}

            {!isLoading && !isError && (
                <div className="space-y-4">
                    {services.length === 0 ? (
                        <div className="text-center py-16 card">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No service requests yet.</p>
                            <button onClick={() => setShowForm(true)} className="btn-primary">Create Service</button>
                        </div>
                    ) : services.map(s => (
                        <div key={s._id} className="card p-5">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{s.type}</h3>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[s.status]}`}>
                                            {s.status?.replace('_', ' ')}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.isActive ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            {s.isActive ? '● Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{s.user?.firstname} {s.user?.lastname}</span>
                                        {' · '}{ACCOUNT_LABELS[s.account]}
                                        {s.requiresPayment && <span className="ml-2 text-orange-600 dark:text-orange-400 font-semibold">${s.amountRequired} required</span>}
                                    </p>
                                    {s.message && <p className="text-xs text-gray-400 mt-1 italic">"{s.message}"</p>}
                                    {s.requiresPayment && s.depositMethod && (
                                        <p className="text-xs text-gray-400 mt-1">Pay via: <span className="font-medium text-gray-600 dark:text-gray-300">{s.depositMethod?.name}</span> — <span className="font-mono">{s.depositMethod?.value}</span></p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                    <button onClick={() => doToggle({ id: s._id, isActive: !s.isActive })}
                                        title={s.isActive ? 'Deactivate' : 'Activate'}
                                        className={`p-2 rounded-lg transition-colors ${s.isActive ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200'}`}>
                                        {s.isActive ? <ToggleOn /> : <ToggleOff />}
                                    </button>
                                    {s.isActive && s.status !== 'resolved' && (
                                        <button onClick={() => doResolve(s._id)}
                                            title="Mark Resolved"
                                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors">
                                            <CheckCircle fontSize="small" />
                                        </button>
                                    )}
                                    <button onClick={() => { setEditing(s); setShowForm(true) }}
                                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors">
                                        <Edit fontSize="small" />
                                    </button>
                                    <button onClick={() => setDeleting(s._id)}
                                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Service?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This will permanently remove the service request.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleting(null)} className="flex-1 btn-secondary">Cancel</button>
                            <button onClick={() => doDelete(deleting)} disabled={deleteLoading}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
                                {deleteLoading ? <CircularProgress size={16} style={{ color: 'white' }} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ServiceForm open={showForm} handleClose={() => { setShowForm(false); setEditing(null) }}
                existing={editing} depositMethods={depositMethods} clients={clients} />
        </div>
    )
}

export default AdminServiceRequests
