import { useState, useContext } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { Close, SwapHoriz, CheckCircle, Warning, Lock } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import { useIsBlocked } from '../services/ServiceBanner'

const TRANSFER_MIN = 10
const fmt = (v) => `$${(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// sourceAccount: 'trading' | 'mining'
const TransferModal = ({ isOpen, onClose, sourceAccount = 'trading' }) => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const qc = useQueryClient()
  const _id = auth?.user?._id

  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const isServiceBlocked = useIsBlocked(sourceAccount)

  const { data: clientData } = useQuery(
    ['transfer-client', _id],
    async () => {
      const res = await fetch(`${baseURL}client/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always', enabled: isOpen && !!_id }
  )

  // Check for active approved investment (only relevant for trading account)
  const { data: investmentsData, isLoading: loadingInvestments } = useQuery(
    ['transfer-investments', _id],
    async () => {
      const res = await fetch(`${baseURL}investment/user/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 15000, refetchOnMount: 'always', enabled: isOpen && !!_id && sourceAccount === 'trading' }
  )

  // Check for unprocessed trades on the active investment
  const activeInvestment = investmentsData?.investments?.find(inv => inv.status === 'Approved')
  const { data: tradeActivities, isLoading: loadingTrades } = useQuery(
    ['transfer-trades', activeInvestment?._id],
    async () => {
      const res = await fetch(`${baseURL}trade/activities/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 15000, refetchOnMount: 'always', enabled: isOpen && !!activeInvestment?._id && sourceAccount === 'trading' }
  )

  const unprocessedTrades = tradeActivities?.trades?.filter(t => !t.processed && !t.rejected) || []
  const isInvestmentLocked = sourceAccount === 'trading' && !!activeInvestment && unprocessedTrades.length > 0

  const sourceBalance = sourceAccount === 'trading'
    ? (clientData?.tradingBalance || 0)
    : (clientData?.miningBalance || 0)
  const sourceLabel = sourceAccount === 'trading' ? 'Trading Account' : 'Mining Account'

  const isBlocked = isServiceBlocked || isInvestmentLocked
  const isLoading = loadingInvestments || loadingTrades

  const validate = () => {
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) { setAmountError('Enter a valid amount'); return false }
    if (amt < TRANSFER_MIN) { setAmountError(`Minimum transfer is ${fmt(TRANSFER_MIN)}`); return false }
    if (amt > sourceBalance) { setAmountError(`Insufficient balance. Available: ${fmt(sourceBalance)}`); return false }
    setAmountError('')
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await post(`${baseURL}client/transfer/${_id}`, {
        from: sourceAccount,
        to: 'funding',
        amount: parseFloat(amount)
      }, auth.accessToken)
      qc.invalidateQueries(['dashboard-client', _id])
      qc.invalidateQueries(['transfer-client', _id])
      setStep(3)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Transfer failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setAmount('')
    setAmountError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <SwapHoriz className="text-primary-600 dark:text-primary-400" />
            <h2 className="font-display font-bold text-neutral-900 dark:text-white">Transfer to Funding</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Close fontSize="small" className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6">

          {/* STEP 1 — Enter amount */}
          {step === 1 && (
            <div className="space-y-4">

              {/* Source account info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${sourceAccount === 'trading' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-violet-100 dark:bg-violet-900/30'}`}>
                  <SwapHoriz className={sourceAccount === 'trading' ? 'text-emerald-600 dark:text-emerald-400' : 'text-violet-600 dark:text-violet-400'} fontSize="small" />
                </div>
                <div>
                  <p className="font-sans text-xs text-neutral-400">From</p>
                  <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">{sourceLabel}</p>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">
                    Available: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{fmt(sourceBalance)}</span>
                    <span className="ml-2 text-neutral-400">· Min: {fmt(TRANSFER_MIN)}</span>
                  </p>
                </div>
              </div>

              {/* Investment lock warning */}
              {isLoading && sourceAccount === 'trading' && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                  <CircularProgress size={14} />
                  <p className="font-sans text-sm text-neutral-500">Checking account status...</p>
                </div>
              )}

              {isInvestmentLocked && (
                <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <Lock fontSize="small" className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-sans text-sm font-semibold text-amber-800 dark:text-amber-300">Transfer Locked</p>
                      <p className="font-sans text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        You have an active investment plan with {unprocessedTrades.length} pending trade{unprocessedTrades.length !== 1 ? 's' : ''}. Transfers from your trading account are locked until all trades are completed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Service block warning */}
              {isServiceBlocked && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                  <Warning fontSize="small" className="text-red-500 flex-shrink-0" />
                  <p className="font-sans text-sm text-red-700 dark:text-red-400">Transfers are paused due to an active service request.</p>
                </div>
              )}

              <div>
                <label className="block font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Amount (USD)</label>
                <input
                  type="number" step="0.01" min={TRANSFER_MIN}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
                  placeholder={`Min. ${fmt(TRANSFER_MIN)}`}
                  disabled={isBlocked || isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {amountError && <p className="mt-1 font-sans text-xs text-red-500">{amountError}</p>}
                {!isBlocked && (
                  <button onClick={() => setAmount(sourceBalance.toString())}
                    className="mt-1.5 font-sans text-xs text-primary-600 dark:text-primary-400 hover:underline">
                    Use max
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleClose}
                  className="font-display flex-1 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  Cancel
                </button>
                <button onClick={() => { if (validate()) setStep(2) }} disabled={isBlocked || isLoading}
                  className="font-display flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Confirm */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">Review your transfer details</p>
              <div className="space-y-2">
                {[
                  { label: 'Amount', value: fmt(parseFloat(amount)), highlight: true },
                  { label: 'From', value: sourceLabel },
                  { label: 'To', value: 'Funding Account' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                    <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{row.label}</span>
                    <span className={`font-sans text-sm font-semibold ${row.highlight ? 'text-primary-600 dark:text-primary-400 text-base' : 'text-neutral-900 dark:text-white'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)}
                  className="font-display flex-1 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="font-display flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors">
                  {submitting ? <><CircularProgress size={14} style={{ color: 'white' }} /> Transferring...</> : 'Confirm Transfer'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" fontSize="large" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-1">Transfer Complete!</h3>
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-900 dark:text-white">{fmt(parseFloat(amount))}</span> moved from {sourceLabel} to Funding Account.
                </p>
              </div>
              <button onClick={handleClose}
                className="font-display w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransferModal
