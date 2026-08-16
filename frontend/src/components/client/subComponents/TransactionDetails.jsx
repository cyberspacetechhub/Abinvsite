import { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { CircularProgress } from '@mui/material'
import {
  ArrowBack, ContentCopy, CheckCircle, HourglassEmpty,
  Cancel, ArrowUpward, ArrowDownward, TrendingUp
} from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'

const statusConfig = (status) => {
  switch (status) {
    case 'Approved':
    case 'Completed':
      return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: <CheckCircle fontSize="small" className="text-emerald-500" />, bar: 'bg-emerald-500 w-full' }
    case 'Declined':
    case 'Failed':
      return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: <Cancel fontSize="small" className="text-red-500" />, bar: 'bg-red-500 w-1/3' }
    default:
      return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: <HourglassEmpty fontSize="small" className="text-amber-500" />, bar: 'bg-amber-500 w-1/2' }
  }
}

const typeIcon = (type) => {
  if (type === 'Withdrawal') return <ArrowUpward className="text-white" />
  if (type === 'Investment') return <TrendingUp className="text-white" />
  return <ArrowDownward className="text-white" />
}

const typeGradient = (type) => {
  if (type === 'Withdrawal') return 'from-red-500 to-red-700'
  if (type === 'Investment') return 'from-blue-500 to-blue-700'
  return 'from-emerald-500 to-emerald-700'
}

const Row = ({ label, value, mono }) => (
  <div className="flex items-start justify-between px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
    <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400 flex-shrink-0 mr-4">{label}</span>
    <span className={`font-sans text-sm text-neutral-900 dark:text-white text-right break-all ${mono ? 'font-mono' : 'font-semibold'}`}>{value || '—'}</span>
  </div>
)

const TransactionDetails = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const { data: tx, isError, isLoading, isSuccess } = useQuery(
    ['transaction', id],
    async () => {
      const result = await fetch(`${baseURL}transaction/${id}`, auth.accessToken)
      return result.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const address = tx?.depositMethod?.value || tx?.address || null
  const methodName = tx?.depositMethod?.name || tx?.withdrawalMethod?.name || null
  const status = statusConfig(tx?.status)

  const copyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowBack fontSize="small" /> Back
        </button>

        <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-6">Transaction Details</h1>

        {isLoading && (
          <div className="flex justify-center py-20"><CircularProgress size={28} /></div>
        )}

        {isError && (
          <p className="text-center font-sans text-sm text-red-500 py-12">Failed to load transaction details.</p>
        )}

        {isSuccess && tx && (
          <div className="space-y-4">

            {/* Hero card */}
            <div className={`rounded-2xl bg-gradient-to-br ${typeGradient(tx.type)} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  {typeIcon(tx.type)}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold ${status.bg} ${status.color}`}>
                  {status.icon}
                  {tx.status}
                </span>
              </div>
              <p className="font-sans text-sm text-white/70 mb-1">{tx.type}</p>
              <p className="font-display text-4xl font-bold">
                {tx.type === 'Withdrawal' ? '-' : '+'}${(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="font-sans text-xs text-white/60 mt-2">{formatDate(tx.createdAt)}</p>
            </div>

            {/* Progress bar */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-sm font-semibold text-neutral-900 dark:text-white">Processing Status</p>
                <p className="font-sans text-xs text-neutral-400">
                  {tx.status === 'Pending' ? 'Step 1 of 3' : (tx.status === 'Approved' || tx.status === 'Completed') ? 'Step 3 of 3' : 'Declined'}
                </p>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${status.bar}`} />
              </div>
              <div className="flex justify-between mt-2">
                {['Submitted', 'Under Review', 'Completed'].map((s, i) => (
                  <span key={i} className="font-sans text-xs text-neutral-400">{s}</span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 space-y-2">
              <p className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-3">Transaction Info</p>
              <Row label="Type"        value={tx.type} />
              <Row label="Status"      value={tx.status} />
              <Row label="Amount"      value={`$${(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`} />
              {methodName && <Row label="Method" value={methodName} />}
              <Row label="Date"        value={formatDate(tx.createdAt)} />
              <Row label="Transaction ID" value={tx._id} mono />
            </div>

            {/* Address */}
            {address && (
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5">
                <p className="font-display text-sm font-bold text-neutral-900 dark:text-white mb-3">
                  {tx.type === 'Withdrawal' ? 'Withdrawal Address' : 'Payment Address'}
                </p>
                <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-200 dark:border-neutral-600">
                  <p className="flex-1 font-mono text-sm text-neutral-800 dark:text-white break-all">{address}</p>
                  <button
                    onClick={copyAddress}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-display text-xs font-semibold transition-colors duration-200"
                  >
                    <ContentCopy style={{ fontSize: 13 }} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Pending notice */}
            {tx.status === 'Pending' && (tx.type === 'Deposit' || tx.type === 'Withdrawal') && (
              <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <HourglassEmpty className="text-amber-500 flex-shrink-0 mt-0.5" fontSize="small" />
                <div>
                  <p className="font-display text-sm font-semibold text-amber-800 dark:text-amber-300">Awaiting Confirmation</p>
                  <p className="font-sans text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                    Your {tx.type.toLowerCase()} is currently under review. Our team will process it shortly and your account will be updated automatically.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionDetails
