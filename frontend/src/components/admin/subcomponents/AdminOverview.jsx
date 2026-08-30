import { useState, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import {
  People, TrendingUp, TrendingDown, AccountBalance, AttachMoney,
  ArrowForward, PersonAdd, Payments, VerifiedUser, BuildCircle,
  SwapHoriz, Memory
} from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ToastContainer } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import baseURL from '../../../shared/baseURL'
import DeleteClient from '../adminClient/DeleteClient'
import CreateClient from '../adminClient/CreateClient'
import SearchBar from '../adminClient/SearchBar'

const fmt = (v) => `$${(v || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

const quickLinks = [
  { label: 'Deposits',        to: '/admin/deposits',         icon: TrendingUp,    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Withdrawals',     to: '/admin/withdrawals',      icon: TrendingDown,  color: 'text-red-500 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-900/20'         },
  { label: 'Investments',     to: '/admin/investments',      icon: AttachMoney,   color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20'     },
  { label: 'KYC Review',      to: '/admin/kyc/review',       icon: VerifiedUser,  color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-900/20'       },
  { label: 'Services',        to: '/admin/service-requests', icon: BuildCircle,   color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-900/20'   },
  { label: 'Mining',          to: '/admin/mining-machines',  icon: Memory,        color: 'text-purple-600 dark:text-purple-400',   bg: 'bg-purple-50 dark:bg-purple-900/20'   },
  { label: 'Transactions',    to: '/admin/transactions',     icon: SwapHoriz,     color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800'   },
  { label: 'New Client',      to: null,                      icon: PersonAdd,     color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20', action: true },
]

const CHART_COLORS = { Deposit: '#10b981', Withdrawal: '#ef4444', Investment: '#8b5cf6' }

const AdminOverview = () => {
  const { auth } = useAuth()
  const fetch = useFetch()
  const navigate = useNavigate()

  const [openModal, setOpenModal] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [clientId, setClientId] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, isSuccess } = useQuery(
    ['clients', page],
    async () => {
      const res = await fetch(`${baseURL}client?page=${page}&limit=10`, auth.accessToken)
      return res.data
    },
    { keepPreviousData: true, staleTime: 10000, refetchOnMount: 'always' }
  )

  const { data: txData } = useQuery(
    ['overview-transactions'],
    async () => {
      const res = await fetch(`${baseURL}transaction`, auth.accessToken)
      return res.data
    },
    { staleTime: 15000, refetchOnMount: 'always' }
  )

  // Aggregate stats from clients
  const stats = useMemo(() => {
    const total = data?.count || 0;
    const active = data?.activeCount || 0;
    const verified = data?.verifiedCount || 0;
    const deposits = data?.totalDeposit || 0;
    const withdrawals = data?.totalWithdrawal || 0;
    const investments = data?.totalInvestment || 0;
    return { total, active, verified, deposits, withdrawals, investments }
  }, [data])

  // Chart data — transaction type totals
  const chartData = useMemo(() => {
    const txs = txData?.transactions || []
    const map = { Deposit: 0, Withdrawal: 0, Investment: 0 }
    txs.forEach(tx => { if (map[tx.type] !== undefined) map[tx.type] += tx.amount || 0 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [txData])

  const statCards = [
    { label: 'Total Clients',    value: data?.count ?? stats.total, prefix: '',   icon: People,        accent: 'from-blue-500 to-blue-700',    sub: `${stats.active} active` },
    { label: 'Total Deposits',   value: stats.deposits,             prefix: '$',  icon: TrendingUp,    accent: 'from-emerald-500 to-teal-600', sub: 'All time' },
    { label: 'Total Withdrawals',value: stats.withdrawals,          prefix: '$',  icon: TrendingDown,  accent: 'from-red-500 to-rose-600',     sub: 'All time' },
    { label: 'Total Investments',value: stats.investments,          prefix: '$',  icon: AttachMoney,   accent: 'from-violet-500 to-purple-700',sub: 'All time' },
    { label: 'Verified Clients', value: stats.verified,             prefix: '',   icon: VerifiedUser,  accent: 'from-amber-500 to-orange-600', sub: `of ${stats.total} total` },
  ]

  return (
    <div className="w-full space-y-8">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 font-display"
        >
          <PersonAdd style={{ fontSize: 18 }} /> New Client
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${card.accent} opacity-10 -translate-y-6 translate-x-6`} />
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.accent} mb-3`}>
                <Icon style={{ fontSize: 20, color: 'white' }} />
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 font-display uppercase tracking-wide">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white font-display">
                {isLoading ? '—' : card.prefix === '$'
                  ? fmt(card.value)
                  : (card.value ?? 0).toLocaleString()
                }
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* ── Chart + Quick Actions ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="mb-5 text-base font-bold text-gray-900 dark:text-white font-display">Transaction Summary</h2>
          {chartData.every(d => d.value === 0) ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">No transaction data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v) => [`$${v.toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={CHART_COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4">
            {Object.entries(CHART_COLORS).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="mb-5 text-base font-bold text-gray-900 dark:text-white font-display">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((item, i) => {
              const Icon = item.icon
              const inner = (
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg}`}>
                    <Icon className={item.color} style={{ fontSize: 18 }} />
                  </div>
                  <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 font-display leading-tight">{item.label}</span>
                </div>
              )
              return item.action
                ? <button key={i} onClick={() => setOpenModal(true)} className="text-left">{inner}</button>
                : <Link key={i} to={item.to}>{inner}</Link>
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Clients ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white font-display">Recent Clients</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{data?.count ?? 0} total clients</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar onSelect={() => {}} />
            <Link to="/admin/clients" className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline font-display whitespace-nowrap">
              View all <ArrowForward style={{ fontSize: 14 }} />
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16"><CircularProgress size={28} /></div>
        )}
        {isError && (
          <p className="py-10 text-sm text-center text-red-500">Failed to load clients</p>
        )}
        {isSuccess && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['Client', 'Balance', 'Status', 'Verified', 'Joined', ''].map((h, i) => (
                    <th key={i} className="px-6 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {data?.clients?.length > 0 ? data.clients.map(client => (
                  <tr key={client._id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {client.profile ? (
                            <img src={client.profile} alt="" className="object-cover w-9 h-9 rounded-full border-2 border-gray-100 dark:border-gray-700" />
                          ) : (
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700">
                              <span className="text-sm font-bold text-white">{client.firstname?.slice(0, 1)}</span>
                            </div>
                          )}
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${client.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate dark:text-white">{client.firstname} {client.lastname}</p>
                          <p className="text-xs text-gray-400 truncate">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white font-display">
                        {(client.balance || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        client.isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {client.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        client.isVerified
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      }`}>
                        {client.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/client_details/${client._id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-display"
                        >
                          View
                        </button>
                        <button
                          onClick={() => { setClientId(client._id); setOpenDelete(true) }}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-display"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-sm text-center text-gray-400">No clients found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.totalPage > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400">Page {page} of {data.totalPage}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPage, p + 1))}
                disabled={page === data.totalPage}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteClient open={openDelete} handleClose={() => setOpenDelete(false)} clientId={clientId} url={`${baseURL}client`} />
      <CreateClient open={openModal} handleClose={() => setOpenModal(false)} />
    </div>
  )
}

export default AdminOverview
