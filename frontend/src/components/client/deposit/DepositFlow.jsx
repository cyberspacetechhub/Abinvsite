import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast, ToastContainer } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import {
  AccountBalanceWallet, AccountBalance, ArrowBack,
  CheckCircle, ContentCopy, Dashboard, ArrowForward
} from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import { useTranslation } from 'react-i18next'

const ACCOUNTS = ['Funding Account', 'Trading Account', 'Mining Account']
const STEPS = ['Select Account & Method', 'Enter Amount', 'Review', 'Payment Details']

const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200'
const labelClass = 'block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300'

const DepositFlow = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [step, setStep] = useState(1)
  const [account, setAccount] = useState('')
  const [paymentType, setPaymentType] = useState('') // 'crypto' | 'wire'
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [txRef, setTxRef] = useState('')

  // Fetch deposit methods
  const { data: methodsData, isLoading: methodsLoading } = useQuery(
    ['depositmethods'],
    async () => {
      const res = await fetch(`${baseURL}depositmethod`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const allMethods = methodsData?.depositMethods || []
  const cryptoMethods = allMethods.filter(m => m.type !== 'wire' && m.type !== 'bank')
  const wireMethods   = allMethods.filter(m => m.type === 'wire' || m.type === 'bank')
  const displayMethods = paymentType === 'crypto' ? cryptoMethods : wireMethods

  // Submit deposit
  const createDeposit = async () => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('amount', amount)
    formData.append('depositMethod', selectedMethod._id)
    formData.append('user', auth?.user?._id)
    try {
      await post(`${baseURL}deposit`, formData, auth?.accessToken)
    } catch (err) {
      setIsLoading(false)
      throw err
    }
  }

  const { mutate } = useMutation(createDeposit, {
    onSuccess: (data) => {
      setIsLoading(false)
      queryClient.invalidateQueries('deposits')
      // Generate a reference number from timestamp
      const ref = 'TNX' + Date.now().toString().slice(-8)
      setTxRef(ref)
      setStep(4)
    },
    onError: (err) => {
      setIsLoading(false)
      toast.error(err?.response?.data?.message || 'Something went wrong')
    },
  })

  const handleStep1Next = () => {
    if (!account) return toast.error('Please select an account')
    if (!paymentType) return toast.error('Please select a payment method type')
    setStep(2)
  }

  const handleStep2Next = () => {
    if (!selectedMethod) return toast.error('Please select a payment method')
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt)) return setAmountError('Please enter a valid amount')
    if (amt < selectedMethod.minAmount) return setAmountError(`Minimum deposit is $${selectedMethod.minAmount}`)
    if (amt > selectedMethod.maxAmount) return setAmountError(`Maximum deposit is $${selectedMethod.maxAmount}`)
    setAmountError('')
    setStep(3)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedMethod?.value || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Step indicator ────────────────────────────────────────────────────────
  const StepBar = () => (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((label, i) => {
        const num = i + 1
        const done = step > num
        const active = step === num
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold transition-colors duration-200 ${
                done   ? 'bg-primary-600 text-white' :
                active ? 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/40' :
                         'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
              }`}>
                {done ? <CheckCircle style={{ fontSize: 16 }} /> : num}
              </div>
              <span className={`mt-1 text-xs font-sans hidden sm:block ${active ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${step > num ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-2xl px-4 py-10 mx-auto">

        {/* Back */}
        {step < 4 && (
          <button
            onClick={() => step === 1 ? navigate('/user') : setStep(s => s - 1)}
            className="flex items-center gap-2 mb-6 font-sans text-sm transition-colors text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ArrowBack fontSize="small" /> {step === 1 ? t('navigation.dashboard') : t('common.back')}
          </button>
        )}

        <h1 className="mb-2 text-2xl font-bold font-display text-neutral-900 dark:text-white">{t('deposit.title')}</h1>
        <p className="mb-8 font-sans text-sm text-neutral-500 dark:text-neutral-400">{t('deposit.securePayment')}</p>

        <StepBar />

        <div className="p-6 bg-white border dark:bg-neutral-800 rounded-2xl border-neutral-200 dark:border-neutral-700 shadow-soft">

          {/* ── STEP 1: Account + Method Type ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className={labelClass}>Select account to deposit into</p>
                <div className="space-y-2">
                  {ACCOUNTS.map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => setAccount(acc)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                        account === acc
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <AccountBalanceWallet fontSize="small" className={account === acc ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'} />
                      <span className="text-sm font-semibold font-display">{acc}</span>
                      {account === acc && <CheckCircle fontSize="small" className="ml-auto text-primary-600 dark:text-primary-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className={labelClass}>{t('deposit.selectMethod')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'crypto', label: 'Crypto Wallet', icon: <AccountBalanceWallet />, desc: 'BTC, ETH, USDT & more' },
                    { key: 'wire',   label: 'Wire Transfer', icon: <AccountBalance />,       desc: 'Bank transfer' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => { setPaymentType(opt.key); setSelectedMethod(null) }}
                      className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-200 ${
                        paymentType === opt.key
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <span className={paymentType === opt.key ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'}>{opt.icon}</span>
                      <span className="text-sm font-semibold font-display">{opt.label}</span>
                      <span className="font-sans text-xs text-neutral-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStep1Next}
                className="inline-flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-colors duration-200 rounded-lg font-display bg-primary-600 hover:bg-primary-700"
              >
                Continue <ArrowForward fontSize="small" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Amount + Method Selection ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className={labelClass}>
                  {paymentType === 'crypto' ? 'Select cryptocurrency' : 'Select bank'}
                </p>
                {methodsLoading ? (
                  <div className="flex justify-center py-6"><CircularProgress size={24} /></div>
                ) : displayMethods.length === 0 ? (
                  <p className="py-4 font-sans text-sm text-center text-neutral-400">No {paymentType} methods available</p>
                ) : (
                  <div className="space-y-2">
                    {displayMethods.map((m) => (
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
                        <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold rounded-full w-9 h-9 bg-primary-100 dark:bg-primary-900/30 font-display text-primary-600 dark:text-primary-400">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold font-display text-neutral-900 dark:text-white">{m.name}</p>
                          <p className="font-sans text-xs text-neutral-400">${m.minAmount} – ${m.maxAmount?.toLocaleString()} USD</p>
                        </div>
                        {selectedMethod?._id === m._id && <CheckCircle fontSize="small" className="text-primary-600 dark:text-primary-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t('deposit.amount')} (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
                  placeholder="Enter deposit amount"
                  className={inputClass}
                />
                {amountError && <p className="mt-1 font-sans text-xs text-red-500">{amountError}</p>}
                {selectedMethod && (
                  <p className="mt-1 font-sans text-xs text-neutral-400">
                    Min: ${selectedMethod.minAmount} · Max: ${selectedMethod.maxAmount?.toLocaleString()}
                  </p>
                )}
              </div>

              <button
                onClick={handleStep2Next}
                className="inline-flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-colors duration-200 rounded-lg font-display bg-primary-600 hover:bg-primary-700"
              >
                Continue to Review <ArrowForward fontSize="small" />
              </button>
            </div>
          )}

          {/* ── STEP 3: Review & Confirm ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="pb-4 text-center border-b border-neutral-100 dark:border-neutral-700">
                <h2 className="mb-1 text-xl font-bold font-display text-neutral-900 dark:text-white">Confirm Your Deposit</h2>
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  You are about to deposit <span className="font-semibold text-neutral-900 dark:text-white">${parseFloat(amount).toFixed(2)} USD</span> into your <span className="font-semibold text-neutral-900 dark:text-white">{account}</span>. Please review before proceeding.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Account',        value: account },
                  { label: 'Payment Method', value: paymentType === 'crypto' ? 'Crypto Wallet' : 'Wire Transfer' },
                  { label: 'Selected',       value: selectedMethod?.name },
                  { label: 'You Will Send',  value: `$${parseFloat(amount).toFixed(2)} USD` },
                  { label: 'Amount to Deposit', value: `$${parseFloat(amount).toFixed(2)} USD`, highlight: true },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl ${row.highlight ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'bg-neutral-50 dark:bg-neutral-700/50'}`}>
                    <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{row.label}</span>
                    <span className={`font-display font-semibold text-sm ${row.highlight ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-900 dark:text-white'}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <p className="font-sans text-xs italic text-neutral-400 dark:text-neutral-500">
                * Payment details ({selectedMethod?.name} {paymentType === 'crypto' ? 'wallet address' : 'bank details'}) will be shown once you confirm.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 font-semibold transition-colors duration-200 border rounded-lg font-display border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => mutate()}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center flex-1 gap-2 py-3 font-semibold text-white transition-colors duration-200 rounded-lg font-display bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {isLoading ? <><CircularProgress size={16} style={{ color: 'white' }} /> Processing...</> : t('deposit.proceedDeposit')}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Payment Details ── */}
          {step === 4 && (
            <div className="space-y-6">

              {/* Header */}
              <div className="pb-5 text-center border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle className="text-emerald-600 dark:text-emerald-400" fontSize="large" />
                </div>
                <h2 className="mb-2 text-2xl font-bold font-display text-neutral-900 dark:text-white">Complete Your Payment</h2>
                <p className="max-w-sm mx-auto font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  Your order <span className="font-mono font-semibold text-neutral-900 dark:text-white">{txRef}</span> has been placed. To activate your deposit, send the exact amount shown below to the address provided.
                </p>
              </div>

              {/* Pay summary */}
              <div className="p-5 border rounded-xl bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <p className="mb-3 text-xs font-bold tracking-widest uppercase font-display text-primary-500 dark:text-primary-400">
                  Pay via {selectedMethod?.name}
                </p>
                <p className="text-3xl font-bold font-display text-neutral-900 dark:text-white">
                  ${parseFloat(amount).toFixed(2)} <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400">USD</span>
                </p>
              </div>

              {/* QR Code */}
              {selectedMethod?.qrCode && (
                <div className="flex flex-col items-center gap-2">
                  <p className="font-sans text-xs text-neutral-400">Scan QR code to pay</p>
                  <div className="inline-block p-3 bg-white border dark:bg-neutral-700 rounded-xl border-neutral-200 dark:border-neutral-600 shadow-soft">
                    <img src={selectedMethod.qrCode} alt="QR Code" className="object-contain w-44 h-44" />
                  </div>
                </div>
              )}

              {/* Address */}
              <div>
                <p className="mb-2 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {paymentType === 'crypto' ? `${selectedMethod?.name} Address` : 'Bank Account Details'}
                </p>
                <div className="flex items-center gap-2 p-3 border bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border-neutral-200 dark:border-neutral-600">
                  <p className="flex-1 font-mono text-sm break-all text-neutral-800 dark:text-white">{selectedMethod?.value}</p>
                  <button
                    onClick={copyAddress}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-display text-xs font-semibold transition-colors duration-200"
                  >
                    <ContentCopy style={{ fontSize: 14 }} />
                    {copied ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="px-4 py-3 border rounded-xl bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <p className="font-sans text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                  ⚠ Please send only <span className="font-semibold">{selectedMethod?.name}</span> to this address and ensure the amount matches exactly. Sending a different asset or amount may result in permanent loss of funds and automatic order cancellation.
                </p>
              </div>

              {selectedMethod?.description && (
                <div className="px-4 py-3 border rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border-neutral-200 dark:border-neutral-600">
                  <p className="font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{selectedMethod.description}</p>
                </div>
              )}

              {/* Footer note */}
              <p className="font-sans text-xs text-center text-neutral-400 dark:text-neutral-500">
                Your account will be credited automatically once your payment is received and verified by our team.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2 border-t sm:flex-row border-neutral-100 dark:border-neutral-700">
                <button
                  onClick={() => navigate('/user/transactions')}
                  className="flex-1 py-3 text-sm font-semibold transition-colors duration-200 border rounded-lg font-display border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  {t('navigation.transactions')}
                </button>
                <button
                  onClick={() => navigate('/user')}
                  className="inline-flex items-center justify-center flex-1 gap-2 py-3 text-sm font-semibold text-white transition-colors duration-200 rounded-lg font-display bg-primary-600 hover:bg-primary-700"
                >
                  <Dashboard fontSize="small" /> {t('navigation.dashboard')}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default DepositFlow
