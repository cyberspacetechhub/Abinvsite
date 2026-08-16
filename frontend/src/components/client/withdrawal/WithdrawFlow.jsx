import { useState, useContext } from 'react'
import { useQuery, useMutation } from 'react-query'
import { CircularProgress } from '@mui/material'
import { ArrowBack, ArrowForward, CheckCircle, AccountBalance, CurrencyBitcoin, Warning } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import ServiceBanner, { useIsBlocked } from '../services/ServiceBanner'
import { useTranslation } from 'react-i18next'

const fmt = (v) => `$${(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const WithdrawFlow = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const navigate = useNavigate()
  const _id = auth?.user?._id
  const { t } = useTranslation()

  const [step, setStep] = useState(1) // 1=select account, 2=enter amount, 3=confirm, 4=done
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isBlocked = useIsBlocked('general')

  const { data: clientData } = useQuery(
    ['withdraw-client', _id],
    async () => {
      const res = await fetch(`${baseURL}client/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const { data: accountsData, isLoading: loadingAccounts } = useQuery(
    ['withdrawal-accounts-flow', _id],
    async () => {
      const res = await fetch(`${baseURL}withdrawal-account/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const client = clientData || auth?.user
  const fundingBalance = client?.balance || 0
  const withdrawalLimit = client?.withdrawalLimit || 0
  const accounts = accountsData?.accounts || []

  const validateAmount = () => {
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) { setAmountError('Enter a valid amount'); return false }
    if (amt > fundingBalance) { setAmountError(`Insufficient funding balance. Available: ${fmt(fundingBalance)}`); return false }
    if (withdrawalLimit > 0 && amt > withdrawalLimit) { setAmountError(`Exceeds your withdrawal limit of ${fmt(withdrawalLimit)}`); return false }
    setAmountError('')
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await post(`${baseURL}withdrawal`, {
        user: _id,
        amount: parseFloat(amount),
        withdrawalAccount: selectedAccount._id
      }, auth.accessToken)
      setStep(4)
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response?.data?.error || 'Withdrawal failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-lg mx-auto px-4 py-8">

        <button onClick={() => step > 1 && step < 4 ? setStep(s => s - 1) : navigate(-1)}
          className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 transition-colors">
          <ArrowBack fontSize="small" /> {step === 1 || step === 4 ? t('common.back') : t('common.previous')}
        </button>

        <ServiceBanner account="general" />

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {['Select Account', 'Enter Amount', 'Confirm'].map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400'}`}>
                  {step > i + 1 ? <CheckCircle style={{ fontSize: 16 }} /> : i + 1}
                </div>
                <span className={`font-sans text-xs hidden sm:block ${step === i + 1 ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-400'}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-6">

          {/* STEP 1 — Select withdrawal account */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-1">{t('withdrawal.title')}</h2>
              <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-5">{t('deposit.selectMethod').replace('Select Payment Method', 'Choose where to send your funds')}</p>

              {/* Funding balance info */}
              <div className="mb-5 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                <p className="font-sans text-xs text-neutral-400 mb-0.5">{t('withdrawal.availableBalance')}</p>
                <p className="font-display text-xl font-bold text-neutral-900 dark:text-white">{fmt(fundingBalance)}</p>
                {withdrawalLimit > 0 && (
                  <p className="font-sans text-xs text-amber-600 dark:text-amber-400 mt-1">Withdrawal limit: {fmt(withdrawalLimit)}</p>
                )}
              </div>

              {isBlocked && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="font-sans text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                    <Warning fontSize="small" /> Withdrawals are currently paused due to an active service request.
                  </p>
                </div>
              )}

              {loadingAccounts ? (
                <div className="flex justify-center py-8"><CircularProgress size={24} /></div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-3">No withdrawal accounts saved.</p>
                  <button onClick={() => navigate('/user/withdrawal-accounts')}
                    className="font-display text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                    + Add a withdrawal account
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map(acc => (
                    <button key={acc._id} onClick={() => { setSelectedAccount(acc); setStep(2) }}
                      disabled={isBlocked}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed ${selectedAccount?._id === acc._id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${acc.type === 'crypto' ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                        {acc.type === 'crypto'
                          ? <CurrencyBitcoin className="text-amber-600 dark:text-amber-400" fontSize="small" />
                          : <AccountBalance className="text-blue-600 dark:text-blue-400" fontSize="small" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">{acc.label}</p>
                          {acc.isDefault && <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">Default</span>}
                        </div>
                        <p className="font-mono text-xs text-neutral-400 truncate mt-0.5">
                          {acc.type === 'crypto' ? `${acc.network ? acc.network + ' · ' : ''}${acc.address}` : `${acc.bankName} · ****${acc.accountNumber?.slice(-4)}`}
                        </p>
                      </div>
                      <ArrowForward fontSize="small" className="text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                    </button>
                  ))}
                  <button onClick={() => navigate('/user/withdrawal-accounts')}
                    className="w-full py-3 font-display text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline text-center">
                    + Add new account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Enter amount */}
          {step === 2 && selectedAccount && (
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-1">{t('withdrawal.amount')}</h2>
              <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                Withdrawing to <span className="font-semibold text-neutral-700 dark:text-neutral-300">{selectedAccount.label}</span>
              </p>

              <div className="mb-5 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Available</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{fmt(fundingBalance)}</span>
                </div>
                {withdrawalLimit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Your limit</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{fmt(withdrawalLimit)}</span>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="block font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">{t('withdrawal.amount')} (USD)</label>
                <input
                  type="number" step="0.01" min="0"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                {amountError && <p className="mt-1 font-sans text-xs text-red-500">{amountError}</p>}
                <button onClick={() => setAmount(withdrawalLimit > 0 ? Math.min(fundingBalance, withdrawalLimit).toString() : fundingBalance.toString())}
                  className="mt-1.5 font-sans text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Use max
                </button>
              </div>

                <button onClick={() => { if (validateAmount()) setStep(3) }}
                className="font-display w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors">
                {t('common.next')} <ArrowForward fontSize="small" /></button>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && selectedAccount && (
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-1">{t('common.confirm')}</h2>
              <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-5">Review your withdrawal details before submitting</p>

              <div className="space-y-3 mb-6">
                {[
                  { label: 'Amount', value: fmt(parseFloat(amount)), highlight: true },
                  { label: 'Account', value: selectedAccount.label },
                  { label: 'Type', value: selectedAccount.type === 'crypto' ? 'Crypto Wallet' : 'Bank Account' },
                  selectedAccount.type === 'crypto'
                    ? { label: 'Address', value: selectedAccount.address, mono: true }
                    : { label: 'Bank', value: `${selectedAccount.bankName} · ****${selectedAccount.accountNumber?.slice(-4)}` },
                  { label: 'From', value: 'Funding Account' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
                    <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{row.label}</span>
                    <span className={`font-sans text-sm font-semibold truncate max-w-[60%] text-right ${row.highlight ? 'text-primary-600 dark:text-primary-400 text-base' : row.mono ? 'font-mono text-xs text-neutral-600 dark:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="font-sans text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ Withdrawals are reviewed by admin before processing. You will be notified once approved.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="font-display flex-1 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  {t('common.back')}
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="font-display flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-lg transition-colors">
                  {submitting ? <><CircularProgress size={14} style={{ color: 'white' }} /> Submitting...</> : <><CheckCircle fontSize="small" /> {t('withdrawal.createWithdrawal')}</>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Done */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" fontSize="large" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900 dark:text-white mb-2">Withdrawal Submitted!</h2>
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  Your withdrawal of <span className="font-semibold text-neutral-900 dark:text-white">{fmt(parseFloat(amount))}</span> has been submitted and is pending admin approval.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={() => navigate('/user/withdrawals')} className="font-display flex-1 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  {t('withdrawal.withdrawalHistory')}
                </button>
                <button onClick={() => navigate('/user')} className="font-display flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors">
                  {t('navigation.dashboard')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WithdrawFlow
