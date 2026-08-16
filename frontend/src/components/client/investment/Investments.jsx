import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress, Pagination } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import {
  SwapHoriz, TrendingUp, Lock, AccountBalanceWallet,
  ShowChart, ArrowForward, ArrowBack, CheckCircle, ReceiptLong
} from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'

const fmt = (val) => `$${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const statusClass = (s) => {
  if (s === 'Approved' || s === 'Completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  if (s === 'Declined' || s === 'Failed')    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
}

const Investments = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const _id = auth?.user?._id

  const [page, setPage] = useState(1)
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferFrom, setTransferFrom] = useState('funding') // 'funding' | 'trading'
  const [transferAmount, setTransferAmount] = useState('')
  const [transferError, setTransferError] = useState('')

  // Fetch fresh client data for balances
  const { data: clientData, refetch: refetchClient } = useQuery(
    ['client-investments', _id],
    async () => {
      const res = await fetch(`${baseURL}client/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  // Fetch investment history
  const { data: invData, isLoading, isError, isSuccess } = useQuery(
    ['investments', page],
    async () => {
      const res = await fetch(`${baseURL}investment/user/${_id}?page=${page}&limit=10`, auth.accessToken)
      return res.data
    },
    { keepPreviousData: true, staleTime: 10000, refetchOnMount: 'always' }
  )

  const client = clientData || auth?.user
  const fundingBalance  = client?.balance        || 0
  const tradingBalance  = client?.tradingBalance  || 0
  const profitBalance   = client?.profitBalance   || 0
  const pendingBalance  = client?.pendingBalance  || 0

  // Transfer mutation
  const { mutate: doTransfer, isLoading: transferring } = useMutation(
    async () => {
      const amt = parseFloat(transferAmount)
      const to = transferFrom === 'funding' ? 'trading' : 'funding'
      const res = await post(`${baseURL}client/transfer/${_id}`, { from: transferFrom, to, amount: amt }, auth.accessToken)
      return res.data
    },
    {
      onSuccess: () => {
        toast.success('Transfer completed successfully')
        queryClient.invalidateQueries(['client-investments', _id])
        refetchClient()
        setShowTransfer(false)
        setTransferAmount('')
        setTransferError('')
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Transfer failed')
      }
    }
  )

  const handleTransfer = () => {
    const amt = parseFloat(transferAmount)
    if (!transferAmount || isNaN(amt) || amt <= 0) return setTransferError('Enter a valid amount')
    const sourceBalance = transferFrom === 'funding' ? fundingBalance : tradingBalance
    if (amt > sourceBalance) return setTransferError('Insufficient balance')
    setTransferError('')
    doTransfer()
  }

  const toAccount = transferFrom === 'funding' ? 'Trading Account' : 'Funding Account'
  const fromAccount = transferFrom === 'funding' ? 'Funding Account' : 'Trading Account'

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Investments</h1>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Manage your accounts and track your returns.</p>
          </div>
          <Link
            to="/user/investmentplan"
            className="font-display inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            <TrendingUp fontSize="small" /> Invest Now
          </Link>
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          {/* Funding Account */}
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">Funding Account</p>
                <p className="font-sans text-xs opacity-50 mt-0.5">Main balance</p>
              </div>
              <AccountBalanceWallet className="opacity-40" />
            </div>
            <p className="font-display text-3xl font-bold mb-4">{fmt(fundingBalance)}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="opacity-60 mb-0.5">Available</p>
                <p className="font-display font-bold">{fmt(fundingBalance)}</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="opacity-60 mb-0.5">Pending</p>
                <p className="font-display font-bold">{fmt(pendingBalance)}</p>
              </div>
            </div>
            <button
              onClick={() => { setTransferFrom('funding'); setShowTransfer(true) }}
              className="w-full font-display text-xs font-semibold py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-1.5"
            >
              <SwapHoriz fontSize="small" /> Transfer to Trading Account
            </button>
          </div>

          {/* Trading Account */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">Trading Account</p>
                <p className="font-sans text-xs opacity-50 mt-0.5">Active trading funds</p>
              </div>
              <ShowChart className="opacity-40" />
            </div>
            <p className="font-display text-3xl font-bold mb-4">{fmt(tradingBalance)}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="opacity-60 mb-0.5">Invested</p>
                <p className="font-display font-bold">{fmt(tradingBalance)}</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="opacity-60 mb-0.5">Approx. Profit</p>
                <p className="font-display font-bold text-emerald-200">{fmt(profitBalance)}</p>
              </div>
            </div>
            <button
              onClick={() => { setTransferFrom('trading'); setShowTransfer(true) }}
              className="w-full font-display text-xs font-semibold py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-1.5"
            >
              <SwapHoriz fontSize="small" /> Transfer to Funding Account
            </button>
          </div>
        </div>

        {/* Profit summary strip */}
        <div className="flex items-center gap-3 px-4 py-3 mb-8 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <Lock fontSize="small" className="text-neutral-400" />
          <div className="flex-1">
            <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">Total Profit Earned</p>
            <p className="font-display font-bold text-emerald-600 dark:text-emerald-400">{fmt(profitBalance)}</p>
          </div>
          <Link to="/user/investmentplan" className="font-display text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            View Plans <ArrowForward style={{ fontSize: 14 }} />
          </Link>
        </div>

        {/* Investment History */}
        <div>
          <h2 className="font-display text-base font-bold text-neutral-900 dark:text-white mb-4">Investment History</h2>

          {isLoading && <div className="flex justify-center py-12"><CircularProgress size={24} /></div>}
          {isError && <p className="font-sans text-sm text-red-500 text-center py-8">Failed to load investment history.</p>}

          {isSuccess && (
            <>
              {invData?.investments?.length > 0 ? (
                <div className="space-y-2">
                  {invData.investments.map((inv, i) => (
                    <Link
                      key={i}
                      to={`/user/transaction/${inv._id}`}
                      className="flex items-center justify-between px-4 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp fontSize="small" className="text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {inv.type || 'Investment'}
                          </p>
                          <p className="font-sans text-xs text-neutral-400 mt-0.5">
                            {new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-sm text-blue-600 dark:text-blue-400">
                          +{fmt(inv.amount)}
                        </p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-sans text-xs font-medium mt-1 ${statusClass(inv.status)}`}>
                          {inv.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-14 text-center">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <ReceiptLong className="text-neutral-400" />
                  </div>
                  <p className="font-display font-semibold text-neutral-600 dark:text-neutral-400">No investments yet</p>
                  <p className="font-sans text-sm text-neutral-400 mt-1 mb-4">Start investing to grow your trading account.</p>
                  <Link to="/user/investmentplan" className="font-display text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                    Browse Investment Plans →
                  </Link>
                </div>
              )}

              {invData?.totalPage > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination count={invData.totalPage} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-strong p-6">

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-1">Transfer Funds</h3>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-5">
              Moving funds from <span className="font-semibold text-neutral-900 dark:text-white">{fromAccount}</span> to <span className="font-semibold text-neutral-900 dark:text-white">{toAccount}</span>.
            </p>

            {/* From → To visual */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`flex-1 px-3 py-2 rounded-xl text-center text-xs font-display font-bold ${transferFrom === 'funding' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'}`}>
                {fromAccount}
                <p className="font-sans font-normal text-neutral-400 mt-0.5">{fmt(transferFrom === 'funding' ? fundingBalance : tradingBalance)}</p>
              </div>
              <ArrowForward className="text-neutral-400 flex-shrink-0" fontSize="small" />
              <div className={`flex-1 px-3 py-2 rounded-xl text-center text-xs font-display font-bold ${transferFrom === 'funding' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'}`}>
                {toAccount}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                value={transferAmount}
                onChange={(e) => { setTransferAmount(e.target.value); setTransferError('') }}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
              {transferError && <p className="mt-1 font-sans text-xs text-red-500">{transferError}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowTransfer(false); setTransferAmount(''); setTransferError('') }}
                className="font-display flex-1 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={transferring}
                className="font-display flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-lg transition-colors duration-200"
              >
                {transferring ? <><CircularProgress size={14} style={{ color: 'white' }} /> Transferring...</> : <><CheckCircle fontSize="small" /> Confirm</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Investments
