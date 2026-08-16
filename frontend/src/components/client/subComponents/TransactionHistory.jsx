import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { CircularProgress, Pagination } from '@mui/material'
import { ArrowUpward, ArrowDownward, TrendingUp, ReceiptLong, HourglassEmpty } from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'

const TABS = ['All', 'Deposits', 'Withdrawals', 'Investments']

const statusClass = (status) => {
  switch (status) {
    case 'Approved':
    case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'Declined':
    case 'Failed':    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:          return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  }
}

const typeIcon = (type) => {
  if (type === 'Withdrawal') return <ArrowUpward fontSize="small" className="text-red-500 dark:text-red-400" />
  if (type === 'Investment') return <TrendingUp fontSize="small" className="text-blue-500 dark:text-blue-400" />
  return <ArrowDownward fontSize="small" className="text-emerald-500 dark:text-emerald-400" />
}

const typeIconBg = (type) => {
  if (type === 'Withdrawal') return 'bg-red-50 dark:bg-red-900/20'
  if (type === 'Investment') return 'bg-blue-50 dark:bg-blue-900/20'
  return 'bg-emerald-50 dark:bg-emerald-900/20'
}

const TransactionHistory = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const _id = auth?.user?._id
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('All')

  const { data, isError, isLoading, isSuccess } = useQuery(
    ['transactions', page],
    async () => {
      const result = await fetch(`${baseURL}transaction/user/${_id}?page=${page}&limit=20`, auth.accessToken)
      return result.data
    },
    { keepPreviousData: true, staleTime: 10000, refetchOnMount: 'always' }
  )

  const allTx = data?.transactions || []

  // Pending count for badge — only deposits and withdrawals
  const pendingCount = allTx.filter(
    tx => tx.status === 'Pending' && (tx.type === 'Deposit' || tx.type === 'Withdrawal')
  ).length

  const filtered = activeTab === 'All'
    ? allTx
    : allTx.filter(tx => tx.type === activeTab.slice(0, -1)) // remove trailing 's'

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Transactions</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-display text-xs font-bold">
                <HourglassEmpty style={{ fontSize: 12 }} />
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">A complete record of all your account activity.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1) }}
              className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-soft'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <CircularProgress size={28} />
          </div>
        )}

        {isError && (
          <p className="text-center font-sans text-sm text-red-500 py-12">Failed to load transactions. Please try again.</p>
        )}

        {isSuccess && (
          <>
            {filtered.length > 0 ? (
              <div className="space-y-2">
                {filtered.map((tx, i) => (
                  <Link
                    key={i}
                    to={`/user/transaction/${tx._id}`}
                    className="flex items-center justify-between px-4 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeIconBg(tx.type)}`}>
                        {typeIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {tx.type}
                        </p>
                        <p className="font-sans text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <p className={`font-display font-bold text-sm ${tx.type === 'Withdrawal' ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {tx.type === 'Withdrawal' ? '-' : '+'}${(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-sans text-xs font-medium mt-1 ${statusClass(tx.status)}`}>
                          {tx.status === 'Pending' && <HourglassEmpty style={{ fontSize: 10 }} />}
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <ReceiptLong className="text-neutral-400" />
                </div>
                <p className="font-display font-semibold text-neutral-600 dark:text-neutral-400">No {activeTab === 'All' ? '' : activeTab.toLowerCase()} transactions yet</p>
                <p className="font-sans text-sm text-neutral-400 dark:text-neutral-500 mt-1">Your activity will appear here once you make a transaction.</p>
              </div>
            )}

            {data?.totalPage > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination count={data.totalPage} page={page} onChange={(_, v) => setPage(v)} color="primary" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory
