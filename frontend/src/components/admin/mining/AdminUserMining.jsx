import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { Diamond, PlayArrow, Stop, Add, Remove, DeleteOutline } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useAuth from '../../../hooks/useAuth'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'
import axios from 'axios'

const AdminUserMining = ({ userId }) => {
  const { auth } = useAuth()
  const fetch = useFetch()
  const queryClient = useQueryClient()

  const [creditAmt, setCreditAmt] = useState('')
  const [deductAmt, setDeductAmt] = useState('')

  const { data, isLoading } = useQuery(
    ['admin-user-mining', userId],
    async () => {
      const res = await fetch(`${baseURL}mining-machines/user/${userId}`, auth.accessToken)
      return res.data
    },
    { staleTime: 5000, refetchOnMount: 'always', enabled: !!userId }
  )

  const invalidate = () => queryClient.invalidateQueries(['admin-user-mining', userId])

  const post = async (path, body = {}) => {
    await axios.post(`${baseURL}mining-machines/user/${userId}/${path}`, body, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    })
    invalidate()
  }

  const { mutate: credit, isLoading: crediting } = useMutation(
    () => post('credit', { amount: parseFloat(creditAmt) }),
    { onSuccess: () => { toast.success('Gold mining balance credited'); setCreditAmt('') }, onError: (e) => toast.error(e?.response?.data?.message || 'Failed') }
  )

  const { mutate: deduct, isLoading: deducting } = useMutation(
    () => post('deduct', { amount: parseFloat(deductAmt) }),
    { onSuccess: () => { toast.success('Gold mining balance deducted'); setDeductAmt('') }, onError: (e) => toast.error(e?.response?.data?.message || 'Failed') }
  )

  const { mutate: forceStart, isLoading: starting } = useMutation(
    (index) => post('start', { index }),
    { onSuccess: () => toast.success('Rig started'), onError: (e) => toast.error(e?.response?.data?.message || 'Failed') }
  )

  const { mutate: forceStop, isLoading: stopping } = useMutation(
    (index) => post('stop', { index }),
    { onSuccess: () => toast.success('Rig stopped'), onError: (e) => toast.error(e?.response?.data?.message || 'Failed') }
  )

  const { mutate: removeMachine, isLoading: removing } = useMutation(
    (index) => post('remove', { index }),
    { onSuccess: () => toast.success('Rig removed'), onError: (e) => toast.error(e?.response?.data?.message || 'Failed') }
  )

  const client = data?.client
  const machines = client?.miningMachines || []

  if (isLoading) return <div className="flex justify-center py-8"><CircularProgress /></div>

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Diamond className="text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gold Mining Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gold Mining Balance: <span className="font-bold text-amber-600 dark:text-amber-400">${(client?.miningBalance || 0).toFixed(4)}</span>
          </p>
        </div>
      </div>

      {/* Credit / Deduct */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Credit Gold Mining Balance</p>
          <div className="flex gap-2">
            <input
              type="number" min="0" step="0.01" value={creditAmt}
              onChange={(e) => setCreditAmt(e.target.value)}
              placeholder="Amount"
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => credit()}
              disabled={crediting || !creditAmt}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {crediting ? <CircularProgress size={14} style={{ color: 'white' }} /> : <Add fontSize="small" />}
            </button>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deduct Gold Mining Balance</p>
          <div className="flex gap-2">
            <input
              type="number" min="0" step="0.01" value={deductAmt}
              onChange={(e) => setDeductAmt(e.target.value)}
              placeholder="Amount"
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => deduct()}
              disabled={deducting || !deductAmt}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {deducting ? <CircularProgress size={14} style={{ color: 'white' }} /> : <Remove fontSize="small" />}
            </button>
          </div>
        </div>
      </div>

      {/* Owned Machines */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Owned Rigs ({machines.length})
        </p>
        {machines.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No rigs owned.</p>
        ) : (
          <div className="space-y-3">
            {machines.map((m, i) => (
              <div key={i} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.hashrate} · Total earned: ${(m.totalMined || 0).toFixed(4)}</p>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    m.status === 'running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                    m.status === 'stopped' ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>{m.status}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {m.status !== 'running' ? (
                    <button
                      onClick={() => forceStart(i)}
                      disabled={starting}
                      title="Force Start"
                      className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50"
                    >
                      {starting ? <CircularProgress size={14} /> : <PlayArrow fontSize="small" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => forceStop(i)}
                      disabled={stopping}
                      title="Force Stop"
                      className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                    >
                      {stopping ? <CircularProgress size={14} /> : <Stop fontSize="small" />}
                    </button>
                  )}
                  <button
                    onClick={() => removeMachine(i)}
                    disabled={removing}
                    title="Remove Rig"
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {removing ? <CircularProgress size={14} /> : <DeleteOutline fontSize="small" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUserMining
