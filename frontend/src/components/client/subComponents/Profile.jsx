import { useState, useContext } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import {
  PhotoCamera, CheckCircle, Cancel, Edit, Lock,
  CopyAll, ArrowBack, VerifiedUser, TrendingUp, Memory,
  AccountBalanceWallet, ArrowForward
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import UploadProfile from '../../utils/Uploadprofile'
import countries from '../../utils/countries'
import { useTranslation } from 'react-i18next'

const fmt = (v) => `$${(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
    <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
    <span className="font-sans text-sm font-semibold text-neutral-900 dark:text-white">{value || '—'}</span>
  </div>
)

const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200'
const labelClass = 'block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300'

const Profile = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const update = useUpdate()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { id } = useParams()

  const [editing, setEditing] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'all' })

  const { data: client, isLoading, isError, isSuccess } = useQuery(
    ['client', id],
    async () => {
      const res = await fetch(`${baseURL}client/${id}`, auth.accessToken)
      // Pre-fill form
      if (res.data) {
        Object.entries(res.data).forEach(([k, v]) => setValue(k, v))
      }
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const { mutate: doUpdate, isLoading: updating } = useMutation(
    async (data) => {
      const formData = new FormData()
      for (const key in data) formData.append(key, data[key])
      await update(`${baseURL}client`, formData, auth.accessToken)
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully')
        queryClient.invalidateQueries(['client', id])
        setEditing(false)
      },
      onError: (err) => toast.error(err?.response?.data?.error || 'Update failed')
    }
  )

  const copyRef = () => {
    navigator.clipboard.writeText(client?.referralCode || '')
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const kycColor = {
    approved:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending:       'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    rejected:      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    not_submitted: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400',
  }

  const quickLinks = [
    { icon: <Lock fontSize="small" />, label: 'Change Password', to: '/user/change-password' },
    { icon: <VerifiedUser fontSize="small" />, label: 'KYC Verification', to: '/user/kyc/status' },
    { icon: <TrendingUp fontSize="small" />, label: 'Investments', to: '/user/investments' },
    { icon: <Memory fontSize="small" />, label: 'Mining', to: '/user/mining' },
  ]

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <ArrowBack fontSize="small" /> Back
        </button>

        {isLoading && <div className="flex justify-center py-20"><CircularProgress size={28} /></div>}
        {isError && <p className="text-center font-sans text-sm text-red-500 py-12">Failed to load profile.</p>}

        {isSuccess && client && (
          <div className="space-y-4">

            {/* Avatar + name card */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-6">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden shadow-medium">
                    {client.profile
                      ? <img src={client.profile} alt="Profile" className="w-full h-full object-cover" />
                      : <span className="font-display text-2xl font-bold text-white">{client.firstname?.slice(0, 1)}</span>
                    }
                  </div>
                  <button
                    onClick={() => setOpenUpload(true)}
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center shadow-soft hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <PhotoCamera style={{ fontSize: 14 }} className="text-neutral-600 dark:text-neutral-300" />
                  </button>
                </div>

                {/* Name + status */}
                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-xl font-bold text-neutral-900 dark:text-white truncate">
                    {client.firstname} {client.lastname}
                  </h1>
                  <p className="font-sans text-sm text-neutral-400 truncate">{client.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-xs font-medium ${client.isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {client.isVerified ? <CheckCircle style={{ fontSize: 12 }} /> : <Cancel style={{ fontSize: 12 }} />}
                      {client.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-xs font-medium ${client.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'}`}>
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-xs font-medium ${kycColor[client.kycStatus] || kycColor.not_submitted}`}>
                      KYC: {client.kycStatus?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(e => !e)}
                  className="flex-shrink-0 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Edit fontSize="small" />
                </button>
              </div>

              {/* Referral code */}
              <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                <span className="font-sans text-xs text-neutral-400 flex-shrink-0">Referral Code</span>
                <span className="font-mono text-sm font-semibold text-primary-600 dark:text-primary-400 flex-1">{client.referralCode}</span>
                <button onClick={copyRef} className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-display text-xs font-semibold transition-colors">
                  <CopyAll style={{ fontSize: 13 }} />
                  {copiedRef ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Account balances */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-5">
              <h2 className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-3">Account Balances</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Funding',  value: fmt(client.balance),        color: 'text-primary-600 dark:text-primary-400'  },
                  { label: 'Trading',  value: fmt(client.tradingBalance),  color: 'text-emerald-600 dark:text-emerald-400'  },
                  { label: 'Profit',   value: fmt(client.profitBalance),   color: 'text-amber-600 dark:text-amber-400'      },
                  { label: 'Mining',   value: fmt(client.miningBalance),   color: 'text-violet-600 dark:text-violet-400'    },
                ].map((b, i) => (
                  <div key={i} className="px-3 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 text-center">
                    <p className="font-sans text-xs text-neutral-400 mb-1">{b.label}</p>
                    <p className={`font-display font-bold text-sm ${b.color}`}>{b.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile details */}
            {!editing && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-5">
                <h2 className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-3">Personal Information</h2>
                <div className="space-y-2">
                  <Row label="Username"  value={client.username} />
                  <Row label="Phone"     value={client.phone} />
                  <Row label="Country"   value={client.country} />
                  <Row label="Address"   value={client.address} />
                  <Row label="Plan"      value={client.plan?.name || 'No plan'} />
                  <Row label="Member Since" value={new Date(client.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                </div>
              </div>
            )}

            {/* Edit form */}
            {editing && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-5">
                <h2 className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit(data => doUpdate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.firstName')}</label>
                      <input type="text" {...register('firstname', { required: true })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>{t('auth.lastName')}</label>
                      <input type="text" {...register('lastname', { required: true })} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Username</label>
                    <input type="text" {...register('username', { required: true })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t('auth.email')}</label>
                    <input type="email" {...register('email', { required: true })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t('profile.phone')}</label>
                    <input type="text" {...register('phone', { required: true })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t('profile.country')}</label>
                    <select {...register('country', { required: true })} className={inputClass}>
                      <option value="">-- Select Country --</option>
                      {countries.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t('profile.address')}</label>
                    <input type="text" {...register('address', { required: true })} className={inputClass} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setEditing(false)} className="font-display flex-1 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={updating} className="font-display flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-lg transition-colors">
                      {updating ? <><CircularProgress size={14} style={{ color: 'white' }} /> Saving...</> : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quick links */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-5">
              <h2 className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-3">Quick Links</h2>
              <div className="space-y-1">
                {quickLinks.map((l, i) => (
                  <Link
                    key={i}
                    to={l.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                  >
                    <span className="text-neutral-400 group-hover:text-primary-500 transition-colors">{l.icon}</span>
                    <span className="font-sans text-sm font-medium flex-1">{l.label}</span>
                    <ArrowForward style={{ fontSize: 14 }} className="text-neutral-300 dark:text-neutral-600 group-hover:text-primary-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}

        <UploadProfile open={openUpload} handleClose={() => setOpenUpload(false)} userId={id} />
      </div>
    </div>
  )
}

export default Profile
