import { useState, useContext, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast, ToastContainer } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import {
  Diamond, SwapHoriz, PlayArrow, Stop, ShoppingCart,
  ArrowForward, CheckCircle, Savings
} from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'
import ServiceBanner, { useIsBlocked } from '../services/ServiceBanner'

const fmt = (val) => `$${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const ACCENTS = [
  'from-yellow-600 to-amber-800',
  'from-amber-500 to-yellow-700',
  'from-yellow-700 to-orange-800',
  'from-amber-600 to-orange-700',
  'from-orange-600 to-amber-800',
]

// Live mining ticker — increments totalMined visually while running
const useLiveMined = (machine, dailyRate) => {
  const [live, setLive] = useState(machine?.totalMined || 0)
  const ref = useRef(null)

  useEffect(() => {
    setLive(machine?.totalMined || 0)
    if (machine?.status !== 'running') {
      clearInterval(ref.current)
      return
    }
    const perSecond = (dailyRate || 0.5) / 86400
    ref.current = setInterval(() => {
      setLive(prev => parseFloat((prev + perSecond).toFixed(6)))
    }, 1000)
    return () => clearInterval(ref.current)
  }, [machine?.status, machine?.machineId, machine?.totalMined, dailyRate])

  return live
}

const MachineCard = ({ machine, index, onStart, onStop, starting, stopping, dailyRate, miningBlocked }) => {
  const liveMined = useLiveMined(machine, dailyRate)
  const isRunning = machine.status === 'running'
  const isStopped = machine.status === 'stopped'

  const startedAt = machine.startedAt ? new Date(machine.startedAt) : null
  const hoursRun = startedAt ? ((Date.now() - startedAt.getTime()) / 3600000).toFixed(1) : 0

  return (
    <div className={`rounded-2xl border bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-soft`}>
      {/* Status bar */}
      <div className={`h-1.5 w-full ${isRunning ? 'bg-emerald-500' : isStopped ? 'bg-neutral-300 dark:bg-neutral-600' : 'bg-amber-400'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-display font-bold text-neutral-900 dark:text-white">{machine.name}</p>
            <p className="font-sans text-xs text-neutral-400 mt-0.5">{machine.hashrate}</p>
          </div>
          <span className={`font-display text-xs font-bold px-2.5 py-1 rounded-full ${
            isRunning ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            isStopped ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {isRunning ? '● Active' : isStopped ? 'Stopped' : 'Idle'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
            <p className="font-sans text-xs text-neutral-400 mb-0.5">Total Earned</p>
            <p className="font-display font-bold text-sm text-emerald-600 dark:text-emerald-400">
              ${liveMined.toFixed(4)}
            </p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-700/50">
            <p className="font-sans text-xs text-neutral-400 mb-0.5">Hours Run</p>
            <p className="font-display font-bold text-sm text-neutral-900 dark:text-white">
              {isRunning ? `${hoursRun}h` : '—'}
            </p>
          </div>
        </div>

        {/* Mining animation */}
        {isRunning && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="font-sans text-xs text-amber-700 dark:text-amber-400">
                Gold mining active — earning ${((dailyRate || 0.5) / 86400).toFixed(6)}/sec
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={() => onStart(index)}
              disabled={starting || miningBlocked}
              className="font-display flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              {starting ? <CircularProgress size={14} style={{ color: 'white' }} /> : <PlayArrow fontSize="small" />}
              Start Rig
            </button>
          ) : (
            <button
              onClick={() => onStop(index)}
              disabled={stopping}
              className="font-display flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              {stopping ? <CircularProgress size={14} style={{ color: 'white' }} /> : <Stop fontSize="small" />}
              Stop & Collect Gold
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const Mining = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const queryClient = useQueryClient()
  const _id = auth?.user?._id

  const [showTransfer, setShowTransfer] = useState(false)
  const [transferFrom, setTransferFrom] = useState('funding')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferError, setTransferError] = useState('')
  const [buyingId, setBuyingId] = useState(null)
  const [startingIdx, setStartingIdx] = useState(null)
  const [stoppingIdx, setStoppingIdx] = useState(null)

  const { data: miningData, refetch } = useQuery(
    ['client-mining', _id],
    async () => {
      const res = await fetch(`${baseURL}client/mining/machines/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const { data: clientData } = useQuery(
    ['client-balance', _id],
    async () => {
      const res = await fetch(`${baseURL}client/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const client = clientData || auth?.user
  const miningBalance = miningData?.miningBalance ?? client?.miningBalance ?? 0
  const fundingBalance = client?.balance || 0
  const ownedMachines = miningData?.owned || client?.miningMachines || []
  const catalog = miningData?.catalog || []
  // build a dailyRate lookup from catalog
  const rateMap = Object.fromEntries(catalog.map(m => [m.machineId, m.dailyRate]))
  const miningBlocked = useIsBlocked('mining')

  // Transfer
  const { mutate: doTransfer, isLoading: transferring } = useMutation(
    async () => {
      const to = transferFrom === 'funding' ? 'mining' : 'funding'
      await post(`${baseURL}client/transfer/${_id}`, { from: transferFrom, to, amount: parseFloat(transferAmount) }, auth.accessToken)
    },
    {
      onSuccess: () => {
        toast.success('Transfer completed')
        refetch()
        setShowTransfer(false)
        setTransferAmount('')
        setTransferError('')
      },
      onError: (err) => toast.error(err?.response?.data?.message || 'Transfer failed')
    }
  )

  const handleTransfer = () => {
    const amt = parseFloat(transferAmount)
    if (!amt || amt <= 0) return setTransferError('Enter a valid amount')
    const src = transferFrom === 'funding' ? fundingBalance : miningBalance
    if (amt > src) return setTransferError('Insufficient balance')
    setTransferError('')
    doTransfer()
  }

  // Buy machine
  const { mutate: doBuy } = useMutation(
    async (machineId) => {
      setBuyingId(machineId)
      await post(`${baseURL}client/mining/buy/${_id}`, { machineId }, auth.accessToken)
    },
    {
      onSuccess: () => { toast.success('Rig purchased!'); refetch(); setBuyingId(null) },
      onError: (err) => { toast.error(err?.response?.data?.message || 'Purchase failed'); setBuyingId(null) }
    }
  )

  // Start machine
  const { mutate: doStart } = useMutation(
    async (index) => {
      setStartingIdx(index)
      await post(`${baseURL}client/mining/start/${_id}`, { index }, auth.accessToken)
    },
    {
      onSuccess: () => { toast.success('Gold mining started!'); refetch(); setStartingIdx(null) },
      onError: (err) => { toast.error(err?.response?.data?.message || 'Failed to start'); setStartingIdx(null) }
    }
  )

  // Stop machine
  const { mutate: doStop } = useMutation(
    async (index) => {
      setStoppingIdx(index)
      const res = await post(`${baseURL}client/mining/stop/${_id}`, { index }, auth.accessToken)
      return res.data
    },
    {
      onSuccess: (data) => {
        toast.success(`Rig stopped. Earned: $${data?.earned?.toFixed(4) || '0.0000'}`)
        refetch()
        setStoppingIdx(null)
      },
      onError: (err) => { toast.error(err?.response?.data?.message || 'Failed to stop'); setStoppingIdx(null) }
    }
  )

  const fromLabel = transferFrom === 'funding' ? 'Funding Account' : 'Gold Mining Account'
  const toLabel   = transferFrom === 'funding' ? 'Gold Mining Account' : 'Funding Account'

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Gold Mining</h1>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Purchase gold mining rigs, start them and earn passive gold income daily.
          </p>
        </div>

        <ServiceBanner account="mining" />

        {/* Account Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          {/* Mining Account */}
          <div className="rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-800 p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">Gold Mining Account</p>
                <p className="font-sans text-xs opacity-50 mt-0.5">Available for rigs</p>
              </div>
              <Diamond className="opacity-40" />
            </div>
            <p className="font-display text-3xl font-bold mb-4">{fmt(miningBalance)}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="opacity-60 mb-0.5">Rigs Owned</p>
                <p className="font-display font-bold">{ownedMachines.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="opacity-60 mb-0.5">Currently Active</p>
                <p className="font-display font-bold">{ownedMachines.filter(m => m.status === 'running').length}</p>
              </div>
            </div>
            <button
              onClick={() => { setTransferFrom('funding'); setShowTransfer(true) }}
              className="w-full font-display text-xs font-semibold py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-1.5"
            >
              <SwapHoriz fontSize="small" /> Fund Gold Mining Account
            </button>
          </div>

          {/* Funding Account (read-only reference) */}
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">Funding Account</p>
                <p className="font-sans text-xs opacity-50 mt-0.5">Main balance</p>
              </div>
              <Savings className="opacity-40" />
            </div>
            <p className="font-display text-3xl font-bold mb-4">{fmt(fundingBalance)}</p>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-xs mb-4">
              <p className="opacity-60 mb-0.5">Total Earned (all rigs)</p>
              <p className="font-display font-bold text-emerald-200">
                ${ownedMachines.reduce((acc, m) => acc + (m.totalMined || 0), 0).toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => { setTransferFrom('mining'); setShowTransfer(true) }}
              className="w-full font-display text-xs font-semibold py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-1.5"
            >
              <SwapHoriz fontSize="small" /> Transfer to Funding Account
            </button>
          </div>
        </div>

        {/* Owned Machines */}
        {ownedMachines.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-base font-bold text-neutral-900 dark:text-white mb-4">Your Rigs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ownedMachines.map((machine, i) => (
                <MachineCard
                  key={i}
                  machine={machine}
                  index={i}
                  onStart={doStart}
                  onStop={doStop}
                  starting={startingIdx === i}
                  stopping={stoppingIdx === i}
                  dailyRate={rateMap[machine.machineId] || 0.5}
                  miningBlocked={miningBlocked}
                />
              ))}
            </div>
          </div>
        )}

        {/* Machine Shop */}
        <div>
          <h2 className="font-display text-base font-bold text-neutral-900 dark:text-white mb-1">Rig Shop</h2>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Purchase rigs using your gold mining account balance.
          </p>
          {catalog.length === 0 && (
            <p className="font-sans text-sm text-neutral-400">No rigs available at the moment.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {catalog.map((m, idx) => {
              const accent = ACCENTS[idx % ACCENTS.length]
              return (
              <div key={m.machineId} className="relative rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-soft">
                <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-4`}>
                    {m.image
                      ? <img src={m.image} alt={m.name} className="w-8 h-8 object-contain" />
                      : <Diamond fontSize="large" className="text-white" />}
                  </div>
                  <p className="font-display font-bold text-neutral-900 dark:text-white mb-1">{m.name}</p>
                  {m.description && <p className="font-sans text-xs text-neutral-400 mb-3">{m.description}</p>}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between">
                      <span className="font-sans text-xs text-neutral-400">Mining Rate</span>
                      <span className="font-display text-xs font-semibold text-neutral-900 dark:text-white">{m.hashrate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-xs text-neutral-400">Daily Earnings</span>
                      <span className="font-display text-xs font-semibold text-emerald-600 dark:text-emerald-400">~${m.dailyRate}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-xs text-neutral-400">Price</span>
                      <span className="font-display text-xs font-bold text-neutral-900 dark:text-white">{fmt(m.price)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => doBuy(m.machineId)}
                    disabled={buyingId === m.machineId || miningBalance < m.price || miningBlocked}
                    className="font-display w-full inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-lg transition-colors duration-200"
                  >
                    {buyingId === m.machineId
                      ? <><CircularProgress size={12} style={{ color: 'white' }} /> Buying...</>
                      : miningBalance < m.price
                      ? 'Insufficient Balance'
                      : <><ShoppingCart fontSize="small" /> Buy Rig</>
                    }
                  </button>
                </div>
              </div>
            )})
          }
          </div>
        </div>

      </div>

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-strong p-6">
            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white mb-1">Transfer Funds</h3>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mb-5">
              From <span className="font-semibold text-neutral-900 dark:text-white">{fromLabel}</span> to <span className="font-semibold text-neutral-900 dark:text-white">{toLabel}</span>.
            </p>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 px-3 py-2 rounded-xl text-center text-xs font-display font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                {fromLabel}
                <p className="font-sans font-normal text-neutral-400 mt-0.5">{fmt(transferFrom === 'funding' ? fundingBalance : miningBalance)}</p>
              </div>
              <ArrowForward className="text-neutral-400 flex-shrink-0" fontSize="small" />
              <div className="flex-1 px-3 py-2 rounded-xl text-center text-xs font-display font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                {toLabel}
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

export default Mining
