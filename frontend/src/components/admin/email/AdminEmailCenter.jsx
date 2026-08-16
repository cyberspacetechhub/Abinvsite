import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import {
  Inbox, Send, Edit, Delete, Refresh, Close,
  AttachFile, ArrowBack, CheckCircle
} from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import baseURL from '../../../shared/baseURL'

const api = (auth) => ({
  get:    (url)        => axios.get(url,        { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
  post:   (url, body)  => axios.post(url, body, { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
  delete: (url)        => axios.delete(url,     { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
})

const fmt = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

// ── Compose Modal ─────────────────────────────────────────────────────────────
const ComposeModal = ({ open, onClose, auth }) => {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ from: 'support@gainereum.com', to: '', subject: '', html: '' })
  const [errors, setErrors] = useState({})

  const { mutate: send, isLoading } = useMutation(
    () => api(auth).post(`${baseURL}resend/send`, form),
    {
      onSuccess: () => {
        toast.success('Email sent successfully')
        queryClient.invalidateQueries('resend-sent')
        onClose()
        setForm({ from: 'support@gainereum.com', to: '', subject: '', html: '' })
      },
      onError: (e) => toast.error(e?.response?.data?.message || 'Failed to send'),
    }
  )

  const validate = () => {
    const e = {}
    if (!form.to.trim())      e.to      = 'Recipient is required'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.html.trim())    e.html    = 'Message body is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="font-display font-bold text-neutral-900 dark:text-white text-lg">New Email</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500">
            <Close fontSize="small" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[
            { label: 'From', key: 'from', type: 'text', placeholder: 'sender@yourdomain.com' },
            { label: 'To',   key: 'to',   type: 'email', placeholder: 'recipient@example.com' },
            { label: 'Subject', key: 'subject', type: 'text', placeholder: 'Email subject' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Message <span className="text-neutral-400 font-normal">(HTML supported)</span>
            </label>
            <textarea
              rows={10}
              value={form.html}
              onChange={(e) => setForm(p => ({ ...p, html: e.target.value }))}
              placeholder="<p>Write your email content here...</p>"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            {errors.html && <p className="mt-1 text-xs text-red-500">{errors.html}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => validate() && send()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {isLoading ? <CircularProgress size={14} style={{ color: 'white' }} /> : <><CheckCircle fontSize="small" /> Send Email</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Email Detail View ─────────────────────────────────────────────────────────
const EmailDetail = ({ email, tab, onBack, onDelete, auth }) => {
  const { data: attachments } = useQuery(
    ['resend-attachments', tab, email.id],
    async () => {
      const url = tab === 'inbox'
        ? `${baseURL}resend/inbox/${email.id}/attachments`
        : `${baseURL}resend/sent/${email.id}/attachments`
      const res = await api(auth).get(url)
      return res.data?.data || []
    },
    { staleTime: 30000 }
  )

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <ArrowBack fontSize="small" /> Back
        </button>
        {tab === 'inbox' && (
          <button
            onClick={() => onDelete(email.id)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
          >
            <Delete fontSize="small" /> Delete
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="font-display font-bold text-xl text-neutral-900 dark:text-white mb-4">
          {email.subject || '(No subject)'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm">
          {[
            { label: 'From',    value: email.from || email.sender },
            { label: 'To',      value: Array.isArray(email.to) ? email.to.join(', ') : email.to },
            { label: 'Date',    value: fmt(email.created_at || email.sent_at) },
            { label: 'Status',  value: email.last_event || email.status || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl px-4 py-3">
              <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
              <p className="font-medium text-neutral-900 dark:text-white truncate">{value || '—'}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6">
          <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Message Body</p>
          </div>
          {email.html ? (
            <iframe
              srcDoc={email.html}
              title="Email body"
              className="w-full min-h-[300px] bg-white"
              sandbox="allow-same-origin"
            />
          ) : (
            <pre className="p-4 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-sans">
              {email.text || '(No content)'}
            </pre>
          )}
        </div>

        {/* Attachments */}
        {attachments?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
              <AttachFile fontSize="small" /> Attachments ({attachments.length})
            </p>
            <div className="space-y-2">
              {attachments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700">
                  <AttachFile className="text-neutral-400" fontSize="small" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{a.filename || a.name || a.id}</p>
                    {a.size && <p className="text-xs text-neutral-400">{(a.size / 1024).toFixed(1)} KB</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Email List Row ────────────────────────────────────────────────────────────
const EmailRow = ({ email, tab, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 border-b border-neutral-100 dark:border-neutral-700 transition-colors"
  >
    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
        {(email.from || email.sender || '?').charAt(0).toUpperCase()}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
          {tab === 'inbox' ? (email.from || email.sender || '—') : (Array.isArray(email.to) ? email.to[0] : email.to) || '—'}
        </p>
        <p className="text-xs text-neutral-400 flex-shrink-0">{fmt(email.created_at || email.sent_at)}</p>
      </div>
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">{email.subject || '(No subject)'}</p>
      {tab === 'sent' && email.last_event && (
        <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          email.last_event === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
          email.last_event === 'bounced'   ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
          'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
        }`}>{email.last_event}</span>
      )}
    </div>
  </button>
)

// ── Main Component ────────────────────────────────────────────────────────────
const AdminEmailCenter = () => {
  const { auth } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('inbox')
  const [selected, setSelected] = useState(null)
  const [compose, setCompose] = useState(false)

  const { data: inbox, isLoading: loadingInbox, refetch: refetchInbox } = useQuery(
    'resend-inbox',
    async () => {
      const res = await api(auth).get(`${baseURL}resend/inbox`)
      return res.data?.data || []
    },
    { staleTime: 30000, refetchOnMount: 'always' }
  )

  const { data: sent, isLoading: loadingSent, refetch: refetchSent } = useQuery(
    'resend-sent',
    async () => {
      const res = await api(auth).get(`${baseURL}resend/sent`)
      return res.data?.data || []
    },
    { staleTime: 30000, refetchOnMount: 'always' }
  )

  const { mutate: deleteEmail, isLoading: deleting } = useMutation(
    (id) => api(auth).delete(`${baseURL}resend/inbox/${id}`),
    {
      onSuccess: () => {
        toast.success('Email deleted')
        setSelected(null)
        queryClient.invalidateQueries('resend-inbox')
      },
      onError: (e) => toast.error(e?.response?.data?.message || 'Delete failed'),
    }
  )

  const emails   = tab === 'inbox' ? (inbox || []) : (sent || [])
  const loading  = tab === 'inbox' ? loadingInbox : loadingSent
  const refetch  = tab === 'inbox' ? refetchInbox : refetchSent

  const tabs = [
    { key: 'inbox', label: 'Inbox',  icon: Inbox, count: inbox?.length },
    { key: 'sent',  label: 'Sent',   icon: Send,  count: sent?.length  },
  ]

  return (
    <div className="w-full h-full flex flex-col">
      <ToastContainer />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage incoming and outgoing emails via Resend</p>
        </div>
        <button
          onClick={() => setCompose(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Edit fontSize="small" /> Compose
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden flex flex-col">

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-neutral-200 dark:border-neutral-700">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSelected(null) }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                tab === key
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Icon fontSize="small" />
              {label}
              {count != null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === key ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
                }`}>{count}</span>
              )}
            </button>
          ))}

          <button
            onClick={() => refetch()}
            className="ml-auto p-2 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors mb-1"
            title="Refresh"
          >
            <Refresh fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {selected ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              <EmailDetail
                email={selected}
                tab={tab}
                onBack={() => setSelected(null)}
                onDelete={deleteEmail}
                auth={auth}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <CircularProgress />
                </div>
              ) : emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  {tab === 'inbox' ? <Inbox className="text-neutral-300 dark:text-neutral-600 mb-3" style={{ fontSize: 48 }} /> : <Send className="text-neutral-300 dark:text-neutral-600 mb-3" style={{ fontSize: 48 }} />}
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium">No emails in {tab}</p>
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                    {tab === 'inbox' ? 'Received emails will appear here' : 'Emails you send will appear here'}
                  </p>
                </div>
              ) : (
                emails.map((email) => (
                  <EmailRow
                    key={email.id}
                    email={email}
                    tab={tab}
                    onClick={() => setSelected(email)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <ComposeModal open={compose} onClose={() => setCompose(false)} auth={auth} />
    </div>
  )
}

export default AdminEmailCenter
