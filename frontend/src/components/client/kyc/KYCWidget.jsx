import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { CheckCircle, HourglassEmpty, Cancel, VerifiedUser, ArrowForward } from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'

const configs = {
  approved: {
    icon: <CheckCircle fontSize="small" className="text-emerald-500" />,
    label: 'Identity Verified',
    hint: 'Your account is fully verified.',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-300',
  },
  pending: {
    icon: <HourglassEmpty fontSize="small" className="text-amber-500" />,
    label: 'KYC Under Review',
    hint: 'Your documents are being reviewed.',
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
  },
  rejected: {
    icon: <Cancel fontSize="small" className="text-red-500" />,
    label: 'KYC Rejected',
    hint: 'Resubmission required.',
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-300',
  },
  not_submitted: {
    icon: <VerifiedUser fontSize="small" className="text-primary-500" />,
    label: 'Verify Your Identity',
    hint: 'Complete KYC to unlock all features.',
    bg: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
    text: 'text-primary-800 dark:text-primary-300',
  },
}

const KYCWidget = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()

  const { data: kycData } = useQuery(
    ['kyc-status-widget', auth?.user?._id],
    async () => {
      try {
        const res = await fetch(`${baseURL}kyc/user/${auth?.user?._id}`, auth.accessToken)
        return res.data
      } catch { return null }
    },
    { staleTime: 60000, enabled: !!auth?.user?._id }
  )

  const status = kycData?.status || 'not_submitted'
  if (status === 'approved') return null

  const cfg = configs[status] || configs.not_submitted

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.bg}`}>
      <span className="flex-shrink-0">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-display text-sm font-semibold ${cfg.text}`}>{cfg.label}</p>
        <p className={`font-sans text-xs ${cfg.text} opacity-80`}>{cfg.hint}</p>
      </div>
      <Link
        to="/user/kyc/status"
        className={`flex-shrink-0 flex items-center gap-1 font-display text-xs font-semibold ${cfg.text} hover:opacity-80 transition-opacity`}
      >
        {status === 'not_submitted' || status === 'rejected' ? 'Verify Now' : 'View'}
        <ArrowForward style={{ fontSize: 13 }} />
      </Link>
    </div>
  )
}

export default KYCWidget
