import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AccountBalanceWallet, Dashboard, CreditCard, CheckCircleRounded, ArrowForward } from '@mui/icons-material'
import AuthContext from '../../context/AuthProvider'

const actions = [
  {
    icon: <AccountBalanceWallet fontSize="large" className="text-white" />,
    title: 'Make a Deposit',
    body: 'Fund your account and start accessing global markets immediately.',
    to: '/user/depositmethod',
    accent: 'from-primary-500 to-primary-700',
    cta: 'Deposit Now',
  },
  {
    icon: <Dashboard fontSize="large" className="text-white" />,
    title: 'Go to Dashboard',
    body: 'Explore your trading dashboard, track your portfolio and monitor markets.',
    to: '/user',
    accent: 'from-accent-emerald to-primary-600',
    cta: 'Open Dashboard',
  },
  {
    icon: <CreditCard fontSize="large" className="text-white" />,
    title: 'Add Withdrawal Account',
    body: 'Set up your withdrawal method so you can cash out your profits anytime.',
    to: '/user/withdrawal-accounts',
    accent: 'from-accent-purple to-primary-700',
    cta: 'Add Account',
  },
]

const WelcomePage = () => {
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate()
  const user = auth?.user

  // Guard — if not a first-time client, redirect to dashboard
  useEffect(() => {
    if (!user) { navigate('/auth/user/login'); return }
    const key = `welcomed_${user._id || user.id}`
    if (localStorage.getItem(key)) {
      navigate('/user')
    }
  }, [user])

  const handleAction = (to) => {
    const key = `welcomed_${user._id || user.id}`
    localStorage.setItem(key, 'true')
    navigate(to)
  }

  if (!user) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-neutral-50 dark:bg-darkBg">

      {/* Confetti-style top accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-accent-emerald to-accent-purple" />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-strong"
      >
        <CheckCircleRounded style={{ fontSize: 52 }} className="text-white" />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-xl mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold font-display md:text-5xl text-neutral-900 dark:text-white">
          Welcome,{' '}
          <span className="text-primary-600 dark:text-primary-400">
            {user.firstname || user.username}!
          </span>
        </h1>
        <p className="font-sans text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Your account has been created successfully. You're now part of a global community of miners. Here's how to get started:
        </p>
      </motion.div>

      {/* Action cards */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 mb-10 md:grid-cols-3">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
            className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white border dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-soft hover:shadow-medium"
          >
            {/* Top accent bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${action.accent}`} />

            <div className="flex flex-col flex-1 p-6">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.accent} flex items-center justify-center mb-4 shadow-soft`}>
                {action.icon}
              </div>

              <h3 className="mb-2 text-lg font-bold font-display text-neutral-900 dark:text-white">
                {action.title}
              </h3>
              <p className="flex-1 mb-6 font-sans text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {action.body}
              </p>

              <button
                onClick={() => handleAction(action.to)}
                className={`font-display inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r ${action.accent} text-white font-semibold text-sm py-3 rounded-lg transition-opacity duration-200 hover:opacity-90`}
              >
                {action.cta}
                <ArrowForward fontSize="small" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skip link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => handleAction('/user')}
        className="font-sans text-sm underline transition-colors duration-200 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 underline-offset-4"
      >
        Skip for now, take me to my dashboard
      </motion.button>

    </div>
  )
}

export default WelcomePage
