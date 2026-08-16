import { useState } from 'react'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useParams, useNavigate } from 'react-router-dom'
import baseURL from '../../../shared/baseURL'
import { CircularProgress } from '@mui/material'
import { useQuery } from 'react-query'
import AdminUpdateClient from './AdminUpdateClient'
import AddToUserBalance from './AddToUserBalance'
import DebitUser from './DebitUser'
import Verify from './Verify'
import Unverify from './Unverify'
import SetWithdrawalLimit from './SetWithdrawalLimit'
import Activate from '../actionQuery/Activate'
import Deactivate from '../actionQuery/Deactivate'
import AddProfit from '../actionQuery/AddProfit'
import ClearUserBalances from '../actionQuery/ClearUserBalances'
import OnMaintenanceAlert from '../actionQuery/OnMaintenanceAlert'
import OffMaintenanceAlert from '../actionQuery/OffMaintenanceAlert'
import OnSecurityAlert from '../actionQuery/OnSecurityAlert'
import OffSecurityAlert from '../actionQuery/OffSecurityAlert'
import OnPlanUpgradeAlert from '../actionQuery/OnPlanUpgradeAlert'
import OffPlanUpgradeAlert from '../actionQuery/OffPlanUpgradeAlert'
import WithdrawalControls from '../clients/WithdrawalControls'
import AdminUserMining from '../mining/AdminUserMining'
import {
  ArrowBack, Person, AccountBalance, Phone, Lock,
  TrendingUp, Add, Remove, Settings, Edit,
  CheckCircle, Cancel, Warning, Security, Upgrade,
  Build, AttachMoney, MoneyOff, DeleteSweep, Tune
} from '@mui/icons-material'

const fmt = (v) => (v || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const BalanceCard = ({ label, value, color }) => (
  <div className="p-4 card">
    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`text-xl font-bold font-display ${color}`}>{fmt(value)}</p>
  </div>
)

const TABS = ['Account', 'Financials', 'Alerts']

const AdminClientDetails = () => {
  const { auth } = useAuth()
  const fetch = useFetch()
  const { id } = useParams()
  const navigate = useNavigate()

  const [client, setClient] = useState(null)
  const [userId, setUserId] = useState('')
  const [tab, setTab] = useState(0)

  // modal states
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [openDebit, setOpenDebit] = useState(false)
  const [openVerify, setOpenVerify] = useState(false)
  const [openUnv, setOpenUnv] = useState(false)
  const [openAc, setOpenAc] = useState(false)
  const [openDe, setOpenDe] = useState(false)
  const [open, setOpen] = useState(false)
  const [openClear, setOpenClear] = useState(false)
  const [openMain, setOpenMain] = useState(false)
  const [openMainOff, setOpenMainOff] = useState(false)
  const [openSec, setOpenSec] = useState(false)
  const [openSecOff, setOpenSecOff] = useState(false)
  const [openPlan, setOpenPlan] = useState(false)
  const [openPlanOff, setOpenPlanOff] = useState(false)
  const [openSetLimit, setOpenSetLimit] = useState(false)

  const handleClientDetails = async () => {
    const result = await fetch(`${baseURL}client/${id}`, auth.accessToken)
    setClient(result.data)
    return result.data
  }

  const { isError, isLoading, isSuccess } = useQuery(
    ['client'],
    handleClientDetails,
    { keepPreviousData: true, staleTime: 10000, refetchOnMount: 'always' }
  )

  const open_ = (setter) => { setter(true); setUserId(client._id) }

  return (
    <div className="w-full">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 btn-secondary">
        <ArrowBack fontSize="small" /> Back
      </button>

      {isLoading && <div className="flex items-center justify-center p-20"><CircularProgress /></div>}
      {isError && <p className="py-8 text-center text-red-500">Error fetching client details</p>}

      {isSuccess && client && (
        <div className="space-y-6">

          {/* Hero card */}
          <div className="p-6 card">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {client.profile ? (
                    <img src={client.profile} alt="Profile" className="object-cover w-16 h-16 border-4 border-gray-200 rounded-full dark:border-gray-600" />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 bg-primary-600 border-4 border-gray-200 rounded-full dark:border-gray-600">
                      <span className="text-xl font-bold text-white">{client.firstname?.slice(0, 1)}</span>
                    </div>
                  )}
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${client.isActive ? 'bg-emerald-400' : 'bg-red-500'}`} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                    {client.firstname} {client.lastname}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${client.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                      {client.isActive ? <CheckCircle style={{ fontSize: 12 }} /> : <Cancel style={{ fontSize: 12 }} />}
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${client.isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                      {client.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick info + withdrawal */}
              <div className="flex flex-col gap-2 text-sm sm:items-end">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Person fontSize="small" />
                  <span className="font-medium text-gray-900 dark:text-white">{client.username || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Phone fontSize="small" />
                  <span className="font-medium text-gray-900 dark:text-white">{client.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Lock fontSize="small" />
                  <span className="font-mono font-medium text-gray-900 dark:text-white">{client.unhashedPswd || 'N/A'}</span>
                </div>
                <div className="mt-1">
                  <WithdrawalControls user={client} onUpdate={handleClientDetails} />
                </div>
              </div>
            </div>
          </div>

          {/* Balance cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <BalanceCard label="Funding" value={client.balance} color="text-emerald-600 dark:text-emerald-400" />
            <BalanceCard label="Profit" value={client.profitBalance} color="text-blue-600 dark:text-blue-400" />
            <BalanceCard label="Trading" value={client.tradingBalance} color="text-purple-600 dark:text-purple-400" />
            <BalanceCard label="Bonus" value={client.bonusBalance} color="text-orange-600 dark:text-orange-400" />
            <BalanceCard label="Mining" value={client.miningBalance} color="text-violet-600 dark:text-violet-400" />
          </div>

          {/* Tabbed actions */}
          <div className="card">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`px-5 py-3 text-sm font-semibold font-display transition-colors duration-150 border-b-2 -mb-px ${
                    tab === i
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Account tab */}
              {tab === 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {client.isActive ? (
                    <ActionBtn icon={<Cancel fontSize="small" />} label="Deactivate" color="red" onClick={() => open_(setOpenDe)} />
                  ) : (
                    <ActionBtn icon={<CheckCircle fontSize="small" />} label="Activate" color="green" onClick={() => open_(setOpenAc)} />
                  )}
                  {client.isVerified ? (
                    <ActionBtn icon={<Cancel fontSize="small" />} label="Unverify" color="red" onClick={() => open_(setOpenUnv)} />
                  ) : (
                    <ActionBtn icon={<CheckCircle fontSize="small" />} label="Verify" color="green" onClick={() => open_(setOpenVerify)} />
                  )}
                  <ActionBtn icon={<Edit fontSize="small" />} label="Update Info" color="gray" onClick={() => { setOpenUpdate(true); setClient(client) }} />
                  <ActionBtn icon={<DeleteSweep fontSize="small" />} label="Clear Balances" color="red" onClick={() => open_(setOpenClear)} />
                </div>
              )}

              {/* Financials tab */}
              {tab === 1 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <ActionBtn icon={<TrendingUp fontSize="small" />} label="Add Profit" color="blue" onClick={() => open_(setOpen)} />
                  <ActionBtn icon={<Add fontSize="small" />} label="Credit Account" color="green" onClick={() => open_(setOpenAdd)} />
                  <ActionBtn icon={<Remove fontSize="small" />} label="Debit Account" color="red" onClick={() => open_(setOpenDebit)} />
                  <ActionBtn icon={<Tune fontSize="small" />} label="Withdrawal Limit" color="purple" onClick={() => open_(setOpenSetLimit)} />
                </div>
              )}

              {/* Alerts tab */}
              {tab === 2 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {client.maintenanceAlert ? (
                    <ActionBtn icon={<Build fontSize="small" />} label="Disable Maintenance" color="red" onClick={() => open_(setOpenMainOff)} />
                  ) : (
                    <ActionBtn icon={<Build fontSize="small" />} label="Enable Maintenance" color="yellow" onClick={() => open_(setOpenMain)} />
                  )}
                  {client.securityAlert ? (
                    <ActionBtn icon={<Security fontSize="small" />} label="Disable Security" color="red" onClick={() => open_(setOpenSecOff)} />
                  ) : (
                    <ActionBtn icon={<Security fontSize="small" />} label="Enable Security" color="orange" onClick={() => open_(setOpenSec)} />
                  )}
                  {client.planUpgradeAlert ? (
                    <ActionBtn icon={<Upgrade fontSize="small" />} label="Disable Upgrade Alert" color="red" onClick={() => open_(setOpenPlanOff)} />
                  ) : (
                    <ActionBtn icon={<Upgrade fontSize="small" />} label="Enable Upgrade Alert" color="purple" onClick={() => open_(setOpenPlan)} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mining panel */}
          <div className="card p-6">
            <AdminUserMining userId={client._id} />
          </div>
        </div>
      )}

      {/* Modals */}
      <AdminUpdateClient open={openUpdate} handleClose={() => setOpenUpdate(false)} client={client} />
      <AddProfit open={open} handleClose={() => setOpen(false)} userId={userId} />
      <AddToUserBalance open={openAdd} handleClose={() => setOpenAdd(false)} userId={userId} />
      <DebitUser open={openDebit} handleClose={() => setOpenDebit(false)} userId={userId} />
      <ClearUserBalances open={openClear} handleClose={() => setOpenClear(false)} userId={userId} />
      <Verify open={openVerify} handleClose={() => setOpenVerify(false)} userId={userId} />
      <Unverify open={openUnv} handleClose={() => setOpenUnv(false)} userId={userId} />
      <Activate open={openAc} handleClose={() => setOpenAc(false)} userId={userId} />
      <Deactivate open={openDe} handleClose={() => setOpenDe(false)} userId={userId} />
      <OnMaintenanceAlert open={openMain} handleClose={() => setOpenMain(false)} userId={userId} />
      <OffMaintenanceAlert open={openMainOff} handleClose={() => setOpenMainOff(false)} userId={userId} />
      <OnSecurityAlert open={openSec} handleClose={() => setOpenSec(false)} userId={userId} />
      <OffSecurityAlert open={openSecOff} handleClose={() => setOpenSecOff(false)} userId={userId} />
      <OnPlanUpgradeAlert open={openPlan} handleClose={() => setOpenPlan(false)} userId={userId} />
      <OffPlanUpgradeAlert open={openPlanOff} handleClose={() => setOpenPlanOff(false)} userId={userId} />
      <SetWithdrawalLimit open={openSetLimit} handleClose={() => setOpenSetLimit(false)} userId={userId} />
    </div>
  )
}

const COLOR_MAP = {
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  red:    'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  blue:   'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  gray:   'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600',
}

const ActionBtn = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold font-display rounded-lg border transition-colors duration-150 ${COLOR_MAP[color]}`}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export default AdminClientDetails
