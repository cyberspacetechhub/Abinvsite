import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import {
  ArrowBack, CheckCircle, HourglassEmpty, Cancel,
  VerifiedUser, CloudUpload, CreditCard, Person, ArrowForward
} from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'
import countries from '../../utils/countries'

const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200'
const labelClass = 'block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300'

const statusConfig = {
  approved: {
    icon: <CheckCircle fontSize="large" className="text-emerald-500" />,
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    title: 'Identity Verified',
    message: 'Your account has been fully verified. You now have access to all platform features and higher transaction limits.',
  },
  pending: {
    icon: <HourglassEmpty fontSize="large" className="text-amber-500" />,
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    title: 'Under Review',
    message: 'Your documents have been submitted and are currently being reviewed by our compliance team. This typically takes 1–3 business days.',
  },
  rejected: {
    icon: <Cancel fontSize="large" className="text-red-500" />,
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    title: 'Verification Rejected',
    message: 'Your KYC submission was not approved. Please review the reason below and resubmit with the correct documents.',
  },
}

const FileUploadBox = ({ label, name, icon, hint, onChange, file }) => (
  <div>
    <label className={labelClass}>
      <span className="flex items-center gap-1.5">{icon} {label}</span>
    </label>
    <label className={`flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-200 ${
      file
        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
        : 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700/50 hover:border-primary-400 dark:hover:border-primary-500'
    }`}>
      <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
      {file ? (
        <>
          <CheckCircle className="text-primary-600 dark:text-primary-400" />
          <p className="font-sans text-xs font-semibold text-primary-600 dark:text-primary-400 text-center truncate max-w-full px-2">{file.name}</p>
        </>
      ) : (
        <>
          <CloudUpload className="text-neutral-400" />
          <p className="font-sans text-xs text-neutral-400 text-center">{hint}</p>
        </>
      )}
    </label>
  </div>
)

const KYCStatus = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ documentType: '', documentNumber: '', fullName: '', dateOfBirth: '', address: '', country: '' })
  const [files, setFiles] = useState({ documentImage: null, selfieImage: null })

  const { data: kycData, isLoading } = useQuery(
    ['kyc-status', auth?.user?._id],
    async () => {
      try {
        const res = await fetch(`${baseURL}kyc/user/${auth?.user?._id}`, auth.accessToken)
        return res.data
      } catch { return null }
    },
    { staleTime: 30000, refetchOnMount: 'always' }
  )

  const handleInput = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleFile  = (e) => setFiles(p => ({ ...p, [e.target.name]: e.target.files[0] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!files.documentImage || !files.selfieImage) return toast.error('Please upload both document and selfie images')
    setLoading(true)
    const data = new FormData()
    Object.keys(formData).forEach(k => data.append(k, formData[k]))
    data.append('documentImage', files.documentImage)
    data.append('selfieImage', files.selfieImage)
    try {
      await axios.post(`${baseURL}kyc/submit/${auth?.user?._id}`, data, {
        headers: { Authorization: `Bearer ${auth.accessToken}`, 'Content-Type': 'multipart/form-data' }
      })
      toast.success('KYC submitted successfully!')
      queryClient.invalidateQueries(['kyc-status', auth?.user?._id])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const showForm = !kycData || kycData?.status === 'rejected'
  const cfg = statusConfig[kycData?.status]

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <ArrowBack fontSize="small" /> Back
        </button>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">KYC Verification</h1>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Verify your identity to unlock full platform access and higher limits.
          </p>
        </div>

        {isLoading && <div className="flex justify-center py-20"><CircularProgress size={28} /></div>}

        {!isLoading && (
          <div className="space-y-4">

            {/* Status card — shown when submitted */}
            {kycData && cfg && (
              <div className={`rounded-2xl border p-5 ${cfg.bg}`}>
                <div className="flex items-center gap-4">
                  {cfg.icon}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display font-bold text-neutral-900 dark:text-white">{cfg.title}</h2>
                      <span className={`font-display text-xs font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                        {kycData.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">{cfg.message}</p>
                    {kycData.status === 'rejected' && kycData.adminNotes && (
                      <p className="font-sans text-sm text-red-600 dark:text-red-400 mt-2">
                        <span className="font-semibold">Reason:</span> {kycData.adminNotes}
                      </p>
                    )}
                    {kycData.submittedAt && (
                      <p className="font-sans text-xs text-neutral-400 mt-2">
                        Submitted: {new Date(kycData.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Approved — no form needed */}
            {kycData?.status === 'approved' && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-5">
                <div className="flex items-center gap-3 mb-4">
                  <VerifiedUser className="text-emerald-500" />
                  <h3 className="font-display font-bold text-neutral-900 dark:text-white">What's unlocked</h3>
                </div>
                <div className="space-y-2">
                  {['Full access to all trading features', 'Higher deposit and withdrawal limits', 'Priority customer support', 'Advanced investment plans'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle fontSize="small" className="text-emerald-500 flex-shrink-0" />
                      <span className="font-sans text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending — show submitted info */}
            {kycData?.status === 'pending' && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-5">
                <h3 className="font-display font-bold text-neutral-900 dark:text-white mb-3">Submitted Details</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Document Type', value: kycData.documentType },
                    { label: 'Full Name',      value: kycData.fullName },
                    { label: 'Country',        value: kycData.country },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                      <span className="font-sans text-sm text-neutral-400">{r.label}</span>
                      <span className="font-sans text-sm font-semibold text-neutral-900 dark:text-white capitalize">{r.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submission form — shown when not submitted or rejected */}
            {showForm && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-6">
                <h3 className="font-display font-bold text-neutral-900 dark:text-white mb-5">
                  {kycData?.status === 'rejected' ? 'Resubmit Your Documents' : 'Submit KYC Documents'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Document type + number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Document Type</label>
                      <select name="documentType" value={formData.documentType} onChange={handleInput} required className={inputClass}>
                        <option value="">Select type</option>
                        <option value="passport">Passport</option>
                        <option value="national_id">National ID</option>
                        <option value="drivers_license">Driver's License</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Document Number</label>
                      <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleInput} required placeholder="e.g. A12345678" className={inputClass} />
                    </div>
                  </div>

                  {/* Full name + DOB */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name (as on document)</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInput} required placeholder="Full legal name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInput} required className={inputClass} />
                    </div>
                  </div>

                  {/* Country + Address */}
                  <div>
                    <label className={labelClass}>Country</label>
                    <select name="country" value={formData.country} onChange={handleInput} required className={inputClass}>
                      <option value="">Select country</option>
                      {countries.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Residential Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInput} required rows={2} placeholder="Full residential address" className={inputClass} />
                  </div>

                  {/* File uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FileUploadBox
                      label="ID Document Photo"
                      name="documentImage"
                      icon={<CreditCard fontSize="small" className="text-neutral-400" />}
                      hint="Clear photo of your ID, passport or license"
                      onChange={handleFile}
                      file={files.documentImage}
                    />
                    <FileUploadBox
                      label="Selfie with Document"
                      name="selfieImage"
                      icon={<Person fontSize="small" className="text-neutral-400" />}
                      hint="Photo of you holding your document"
                      onChange={handleFile}
                      file={files.selfieImage}
                    />
                  </div>

                  {/* Guidelines */}
                  <div className="px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <p className="font-display text-xs font-bold text-primary-700 dark:text-primary-300 mb-2">Submission Guidelines</p>
                    <ul className="space-y-1">
                      {[
                        'All document details must be clearly visible and legible',
                        'Photos must be well-lit, in focus and unobstructed',
                        'Maximum file size: 10MB per image (JPG, PNG, WebP)',
                        'Selfie must show your face and document together clearly',
                      ].map((g, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowForward style={{ fontSize: 12 }} className="text-primary-500 flex-shrink-0 mt-0.5" />
                          <span className="font-sans text-xs text-primary-700 dark:text-primary-300">{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  >
                    {loading
                      ? <><CircularProgress size={16} style={{ color: 'white' }} /> Submitting...</>
                      : <><VerifiedUser fontSize="small" /> Submit for Verification</>
                    }
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default KYCStatus
