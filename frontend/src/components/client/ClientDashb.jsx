import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { toast, ToastContainer } from 'react-toastify'
import {
  CopyAll, Visibility, VisibilityOff, ArrowUpward, ArrowDownward,
  AccountBalanceWallet, TrendingUp, SwapHoriz, History, Savings,
  ManageAccounts, FlashOn, Shield, BarChart, ChevronRight, Memory
} from '@mui/icons-material'
import AuthContext from '../../context/AuthProvider'
import useFetch from '../../hooks/useFetch'
import baseURL from '../../shared/baseURL'
import MaintenanceBadge from './notifications/MaintenanceBadge'
import SecBadge from './notifications/SecBadge'
import PlanUpgradeBadge from './notifications/PlanUpgradeBadge'
import TransferModal from './transfer/TransferModal'
import KYCWidget from './kyc/KYCWidget'
import { Swiper, SwiperSlide } from '../utils/Swiper'
import ServiceBanner from './services/ServiceBanner'
import { useTranslation } from 'react-i18next'

// ── Account card data ────────────────────────────────────────────────────────
const getAccounts = (user) => [
  {
    type: 'Funding Account',
    label: 'ACC. 1 of 3',
    username: user?.username || '—',
    currency: 'USD',
    balance: user?.balance || 0,
    depositLink: '/user/deposit-flow',
    withdrawLink: '/user/withdrawals',
    accent: 'from-primary-600 to-primary-800',
  },
  {
    type: 'Trading Account',
    label: 'ACC. 2 of 3',
    username: user?.username || '—',
    currency: 'USD',
    balance: user?.tradingBalance || 0,
    depositLink: '/user/deposit-flow?account=trading',
    withdrawLink: '/user/withdrawals',
    accent: 'from-emerald-600 to-teal-700',
  },
  {
    type: 'Mining Account',
    label: 'ACC. 3 of 3',
    username: user?.username || '—',
    currency: 'USD',
    balance: user?.miningBalance || 0,
    depositLink: '/user/deposit-flow?account=mining',
    withdrawLink: '/user/withdrawals',
    accent: 'from-violet-600 to-purple-800',
  },
]

// ── Quick action cards ───────────────────────────────────────────────────────
const quickActions = [
  { labelKey: 'navigation.deposit',     icon: ArrowDownward,   to: '/user/deposit-flow',        color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { labelKey: 'navigation.withdraw',    icon: ArrowUpward,     to: '/user/withdrawals',          color: 'text-red-500 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-900/20'         },
  { labelKey: 'investment.investNow',   icon: TrendingUp,      to: '/user/investmentplan',       color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-900/20'       },
  { labelKey: 'navigation.transactions',icon: History,         to: '/user/transactions',         color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20'     },
  { labelKey: 'navigation.investment',  icon: Savings,         to: '/user/investments',          color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-900/20'   },
  { labelKey: 'navigation.mining',      icon: Memory,          to: '/user/mining',               color: 'text-purple-600 dark:text-purple-400',   bg: 'bg-purple-50 dark:bg-purple-900/20'   },
  { labelKey: 'navigation.settings',    icon: ManageAccounts,  to: '/user/withdrawal-accounts',  color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800'   },
]

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  { tag: 'Speed',     icon: <FlashOn className="text-primary-400" />, title: 'Lightning-Fast Execution',   body: 'Every order is routed through our proprietary engine for sub-millisecond fills across 30+ global venues.' },
  { tag: 'Security',  icon: <Shield className="text-primary-400" />,  title: 'Military-Grade Protection',  body: 'Cold storage custody, real-time fraud detection and end-to-end encryption keep your funds safe 24/7.' },
  { tag: 'Analytics', icon: <BarChart className="text-primary-400" />,title: 'Institutional-Grade Insights',body: 'AI-powered market analytics and live signals give you the edge professional traders rely on every day.' },
]

// ── Component ─────────────────────────────────────────────────────────────────
const ClientDashb = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const _id = auth?.user?._id
  const [showBalance, setShowBalance] = useState(false)
  const [activeAccount, setActiveAccount] = useState(0)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [transferSource, setTransferSource] = useState('trading')

  const { data: clientData } = useQuery(
    ['dashboard-client', _id],
    async () => {
      const res = await fetch(`${baseURL}client/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const user = clientData || auth?.user
  const accounts = getAccounts(user)

  const { data, isSuccess } = useQuery(
    ['transactions'],
    async () => {
      const result = await fetch(`${baseURL}transaction/user/${_id}?page=1&limit=5`, auth.accessToken)
      return result.data
    },
    { keepPreviousData: true, staleTime: 10000, refetchOnMount: 'always' }
  )

  const fmt = (val) =>
    showBalance
      ? `$${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '**********'

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />

      {/* ── Alerts ── */}
      <div className="max-w-4xl px-4 pt-6 mx-auto space-y-3">
        {auth?.user?.maintenanceAlert && <MaintenanceBadge />}
        {auth?.user?.securityAlert     && <SecBadge />}
        {auth?.user?.planUpgradeAlert  && <PlanUpgradeBadge />}
        {(!auth?.user?.isVerified || auth?.user?.kycStatus !== 'approved') && <KYCWidget />}
        <ServiceBanner account={null} />
      </div>

      {/* ── Welcome ── */}
      <div className="flex items-center justify-between max-w-4xl px-4 pt-6 pb-2 mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
            Welcome back, <span className="text-primary-600 dark:text-primary-400">{auth?.user?.firstname}!</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{t('common.referral')}:</span>
            <span className="font-mono text-sm font-semibold text-primary-600 dark:text-primary-400">{auth?.user?.referralCode}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(auth?.user?.referralCode); toast.success('Copied!') }}
              className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <CopyAll fontSize="small" className="text-neutral-400" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowBalance(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-display font-semibold transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          {showBalance ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          {showBalance ? t('common.hideBalance') : t('common.showBalance')}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — Account Cards Swiper
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="pt-6 pb-10 mt-4 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <p className="mb-4 text-xs font-semibold tracking-widest text-center uppercase font-display text-primary-200 dark:text-neutral-400">
          {t('common.myAccounts')}
        </p>

        <Swiper
          slidesPerView={1.15}
          centeredSlides={true}
          spaceBetween={16}
          breakpoints={{ 640: { slidesPerView: 1.4 }, 1024: { slidesPerView: 2.2 } }}
          on={{ slideChange: (s) => setActiveAccount(s.activeIndex) }}
        >
          {accounts.map((acc, i) => (
            <SwiperSlide key={i}>
              <div className={`relative rounded-2xl bg-gradient-to-br ${acc.accent} p-6 text-white shadow-strong mx-1 cursor-pointer select-none`}>
                {/* Card header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase font-display opacity-70">{acc.type}</p>
                    <p className="font-sans text-xs opacity-50 mt-0.5">{acc.label}</p>
                  </div>
                  <span className="font-display text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{acc.currency}</span>
                </div>

                {/* Username */}
                <p className="mb-1 font-mono text-sm opacity-70">{acc.username}</p>

                {/* Balance */}
                <p className="mb-1 font-sans text-xs opacity-60">{t('dashboard.availableBalance')}</p>
                <p className="mb-6 text-3xl font-bold tracking-tight font-display">
                  {fmt(acc.balance)}
                </p>

                 {/* Buttons */}
                 <div className="flex gap-3">
                   <Link
                     to={acc.depositLink}
                     className="flex-1 font-display text-sm font-semibold text-center py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors duration-200"
                   >
                     + {t('navigation.deposit')}
                   </Link>
                   {i === 0 ? (
                     <Link
                       to="/user/withdraw-flow"
                       className="flex-1 font-display text-sm font-semibold text-center py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors duration-200"
                     >
                       − {t('navigation.withdraw')}
                     </Link>
                   ) : (
                     <button
                       onClick={() => { setTransferSource(i === 1 ? 'trading' : 'mining'); setIsTransferOpen(true) }}
                       className="flex-1 font-display text-sm font-semibold text-center py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors duration-200"
                     >
                       ⇄ {t('common.transfer')}
                     </button>
                   )}
                 </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {accounts.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeAccount ? 'bg-white w-5' : 'bg-white/30'}`} />
          ))}
        </div>

        {/* Recent transactions per active account */}
        <div className="max-w-2xl px-4 mx-auto mt-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold font-display text-white/80">{t('dashboard.recentTransactions')}</p>
            <Link to="/user/transactions" className="flex items-center gap-1 font-sans text-xs transition-colors text-primary-200 dark:text-neutral-400 hover:text-white">
              View all <ChevronRight fontSize="small" />
            </Link>
          </div>
          {isSuccess && data?.transactions?.length > 0 ? (
            <div className="space-y-2">
              {data.transactions.slice(0, 4).map((tx, i) => (
                <Link
                  key={i}
                  to={`/user/transaction/${tx._id}`}
                  className="flex items-center justify-between px-4 py-3 transition-colors duration-200 rounded-xl bg-white/10 hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'Withdrawal' ? 'bg-red-400/20' : 'bg-emerald-400/20'}`}>
                      {tx.type === 'Withdrawal'
                        ? <ArrowUpward style={{ fontSize: 16 }} className="text-red-300" />
                        : <ArrowDownward style={{ fontSize: 16 }} className="text-emerald-300" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white font-display">{tx.type}</p>
                      <p className="font-sans text-xs text-white/50">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <p className={`font-display text-sm font-bold ${tx.type === 'Withdrawal' ? 'text-red-300' : 'text-emerald-300'}`}>
                    {tx.type === 'Withdrawal' ? '-' : '+'}${(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-4 font-sans text-sm text-center text-white/40">{t('common.noTransactions')}</p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — Quick Actions
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl px-4 py-10 mx-auto">
        <h2 className="mb-5 text-lg font-bold font-display text-neutral-900 dark:text-white">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <Link
                key={i}
                to={action.to}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.bg}`}>
                  <Icon className={action.color} />
                </div>
                <span className="text-xs font-semibold leading-tight text-center font-display text-neutral-700 dark:text-neutral-300">{t(action.labelKey)}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — Features
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 py-12 border-t bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto">

          <h2 className="mb-6 text-lg font-bold font-display text-neutral-900 dark:text-white">Features</h2>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-900 shadow-strong">
              <div className="flex items-center gap-3 mb-6">
                <img src="/gainereumlogo2.png" alt="Stock Exchange Mining" className="object-contain w-9 h-9" />
                <span className="text-sm font-bold tracking-widest uppercase font-display text-primary-200">Stock Exchange Mining</span>
              </div>
              <h3 className="mb-4 text-3xl font-bold leading-snug text-white md:text-4xl font-display">
                Build Wealth With Every Trade You Make
              </h3>
              <p className="max-w-2xl mb-8 font-sans text-base leading-relaxed text-primary-200">
                A next-generation investment platform engineered for consistent returns, institutional-grade security, and total control over your financial future.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Multiple Plans', '24/7 Support', 'Zero Commission', 'Global Markets', 'Instant Withdrawals', 'AI-Powered Signals', 'Secure Custody'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-semibold text-white border rounded-full font-display bg-white/15 border-white/20 hover:bg-white/25 transition-colors duration-200">
                    {tag}
                  </span>
                ))}
              </div>
          </div>
        </div>
      </div>

      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} sourceAccount={transferSource} />
     </div>
  )
}

export default ClientDashb
