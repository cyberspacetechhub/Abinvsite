import { useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import {
  ArrowBack, TrendingUp, AccountBalanceWallet, ContentCopy,
  CheckCircle, ArrowForward
} from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import ServiceBanner, { useIsBlocked } from '../services/ServiceBanner'

const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200'
const labelClass = 'block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300'

const InvestmentPlanDetails = () => {
  const { id } = useParams()
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [mode, setMode] = useState(null) // 'balance' | 'deposit'
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1) // 1=choose mode, 2=form, 3=confirm/done

  // Fetch plan
  const { data: planData, isLoading: planLoading } = useQuery(
    ['investmentPlan', id],
    async () => {
      const res = await fetch(`${baseURL}investmentplan/${id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  // Fetch deposit methods (for deposit mode)
  const { data: methodsData } = useQuery(
    ['depositmethods-invest'],
    async () => {
      const res = await fetch(`${baseURL}depositmethod`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  // Fetch client balance
  const { data: clientData } = useQuery(
    ['client-invest', auth?.user?._id],
    async () => {
      const res = await fetch(`${baseURL}client/${auth?.user?._id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const plan = planData
  const methods = methodsData?.depositMethods || []
  const tradingBalance = clientData?.tradingBalance || auth?.user?.tradingBalance || 0
  const currentPlanId = clientData?.plan?._id || clientData?.plan || auth?.user?.plan?._id || auth?.user?.plan
  const isCurrentPlan = currentPlanId && currentPlanId.toString() === id
  const tradingBlocked = useIsBlocked('trading')

  const validateAmount = () => {
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt)) return setAmountError('Please enter a valid amount')
    if (amt < plan?.minAmount) return setAmountError(`Minimum investment is $${plan?.minAmount?.toLocaleString()}`)
    if (amt > plan?.maxAmount) return setAmountError(`Maximum investment is $${plan?.maxAmount?.toLocaleString()}`)
    if (mode === 'balance' && amt > tradingBalance) return setAmountError('Insufficient trading balance')
    setAmountError('')
    return true
  }

  // Invest from balance
  const { mutate: investFromBalance, isLoading: investingBalance } = useMutation(
    async () => {
      await post(`${baseURL}investment/invest-from-balance`, {
        amount: parseFloat(amount),
        user: auth?.user?._id,
        investmentPlan: id
      }, auth.accessToken)
    },
    {
      onSuccess: () => {
        toast.success('Investment placed successfully!')
        queryClient.invalidateQueries('transactions')
        setStep(3)
      },
      onError: (err) => toast.error(err?.response?.data?.error || 'Investment failed')
    }
  )

  // Invest via deposit
  const { mutate: investViaDeposit, isLoading: investingDeposit } = useMutation(
    async () => {
      const formData = new FormData()
      formData.append('amount', parseFloat(amount))
      formData.append('depositMethod', selectedMethod._id)
      formData.append('investmentPlan', id)
      formData.append('user', auth?.user?._id)
      await post(`${baseURL}investment`, formData, auth.accessToken)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions')
        setStep(3)
      },
      onError: (err) => toast.error(err?.response?.data?.error || 'Investment failed')
    }
  )

  const handleContinue = () => {
    if (validateAmount() !== true) return
    if (mode === 'deposit' && !selectedMethod) return toast.error('Please select a payment method')
    if (mode === 'balance') investFromBalance()
    else investViaDeposit()
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedMethod?.value || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (planLoading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-neutral-50 dark:bg-darkBg">
      <CircularProgress size={28} />
    </div>
  )

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <ArrowBack fontSize="small" /> {step === 1 ? 'Back to Plans' : 'Back'}
        </button>

        <ServiceBanner account="trading" />

        {/* Plan summary card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white mb-6">
          <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70 mb-2">Selected Plan</p>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{plan?.name}</h2>
              <p className="font-sans text-xs opacity-60 mt-0.5">{plan?.noOfTimes} trade{plan?.noOfTimes > 1 ? 's' : ''} daily · {plan?.duration} days</p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl font-bold">{plan?.interest}%</p>
              <p className="font-sans text-xs opacity-60">daily return</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">
              <p className="opacity-60 mb-0.5">Min</p>
              <p className="font-display font-bold">${plan?.minAmount?.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">
              <p className="opacity-60 mb-0.5">Max</p>
              <p className="font-display font-bold">${plan?.maxAmount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-6">

          {/* STEP 1 — Choose mode */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-4">How would you like to invest?</h3>

              {[
                {
                  key: 'balance',
                  icon: <AccountBalanceWallet className="text-primary-600 dark:text-primary-400" />,
                  title: 'Invest from Trading Balance',
                  desc: isCurrentPlan
                    ? 'You are already on this plan.'
                    : `Use your available trading balance. Current balance: $${tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                  disabled: isCurrentPlan || tradingBlocked
                },
                {
                  key: 'deposit',
                  icon: <TrendingUp className="text-emerald-600 dark:text-emerald-400" />,
                  title: 'Invest via Deposit',
                  desc: 'Send funds directly via crypto or bank transfer to fund this investment.',
                  disabled: false
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { if (!opt.disabled) { setMode(opt.key); setStep(2) } }}
                  disabled={opt.disabled}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-200 text-left ${
                    opt.disabled
                      ? 'border-neutral-200 dark:border-neutral-700 opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-700/30'
                      : mode === opt.key
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">{opt.title}</p>
                    <p className="font-sans text-xs text-neutral-400 mt-0.5">{opt.desc}</p>
                  </div>
                  <ArrowForward fontSize="small" className="ml-auto text-neutral-300 dark:text-neutral-600" />
                </button>
              ))}
            </div>
          )}

          {/* STEP 2 — Form */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                {mode === 'balance' ? 'Invest from Balance' : 'Invest via Deposit'}
              </h3>

              {/* Deposit method selector */}
              {mode === 'deposit' && (
                <div>
                  <label className={labelClass}>Select payment method</label>
                  <div className="space-y-2">
                    {methods.map((m) => (
                      <button
                        key={m._id}
                        type="button"
                        onClick={() => setSelectedMethod(m)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          selectedMethod?._id === m._id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-display font-bold text-primary-600 dark:text-primary-400 text-sm flex-shrink-0">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">{m.name}</p>
                          <p className="font-sans text-xs text-neutral-400">${m.minAmount} – ${m.maxAmount?.toLocaleString()}</p>
                        </div>
                        {selectedMethod?._id === m._id && <CheckCircle fontSize="small" className="text-primary-600 dark:text-primary-400" />}
                      </button>
                    ))}
                  </div>

                  {/* Show address after method selected */}
                  {selectedMethod && (
                    <div className="mt-3 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                      <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mb-2">Wallet Address</p>
                      <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-600">
                        <p className="flex-1 font-mono text-sm text-neutral-800 dark:text-white break-all">{selectedMethod.value}</p>
                        <button
                          onClick={copyAddress}
                          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-display text-xs font-semibold transition-colors"
                        >
                          <ContentCopy style={{ fontSize: 13 }} />
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      {selectedMethod.description && (
                        <p className="mt-2 font-sans text-xs text-amber-600 dark:text-amber-400">{selectedMethod.description}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Amount */}
              <div>
                <label className={labelClass}>Investment Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
                  placeholder={`Min $${plan?.minAmount?.toLocaleString()} · Max $${plan?.maxAmount?.toLocaleString()}`}
                  className={inputClass}
                />
                {amountError && <p className="mt-1 font-sans text-xs text-red-500">{amountError}</p>}
                {mode === 'balance' && (
                  <p className="mt-1 font-sans text-xs text-neutral-400">
                    Available trading balance: <span className="font-semibold text-neutral-700 dark:text-neutral-300">${tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleContinue}
                disabled={investingBalance || investingDeposit}
                className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                {(investingBalance || investingDeposit)
                  ? <><CircularProgress size={16} style={{ color: 'white' }} /> Processing...</>
                  : <><TrendingUp fontSize="small" /> Confirm Investment</>
                }
              </button>
            </div>
          )}

          {/* STEP 3 — Success */}
          {step === 3 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" fontSize="large" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-white mb-2">Investment Placed!</h3>
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  Your investment of <span className="font-semibold text-neutral-900 dark:text-white">${parseFloat(amount).toFixed(2)}</span> in the <span className="font-semibold text-neutral-900 dark:text-white">{plan?.name}</span> has been submitted successfully.
                  {mode === 'deposit' && ' Please send the exact amount to the address provided.'}
                </p>
              </div>
              {mode === 'deposit' && selectedMethod && (
                <div className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 text-left">
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mb-2">Send to:</p>
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-600">
                    <p className="flex-1 font-mono text-sm text-neutral-800 dark:text-white break-all">{selectedMethod.value}</p>
                    <button onClick={copyAddress} className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-display text-xs font-semibold transition-colors">
                      <ContentCopy style={{ fontSize: 13 }} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/user/investments" className="font-display flex-1 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm text-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  View Investments
                </Link>
                <Link to="/user" className="font-display flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default InvestmentPlanDetails
