import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircleRounded, TrendingUp, Security, FlashOn, BarChart, Shield, StarRounded } from '@mui/icons-material'


const plans = [
  {
    name: 'Basic',
    badge: null,
    description: 'A clean entry point with competitive leverage and no overnight swap charges — ideal for traders building their foundation.',
    deposit: '$5,000',
    leverage: '1:200',
    spread: '0',
    swap: '0',
    minTrade: '0.01 lot',
    accent: 'from-primary-500 to-primary-700',
    featured: false,
  },
  {
    name: 'Standard',
    badge: 'Best Value',
    description: 'Zero spreads, unlimited leverage, and a powerful execution environment built for traders ready to scale their portfolio.',
    deposit: '$20,000',
    leverage: 'Unlimited',
    spread: '0',
    swap: '0',
    minTrade: '0.01 lot',
    accent: 'from-accent-emerald to-primary-600',
    featured: true,
  },
  {
    name: 'Golden',
    badge: null,
    description: 'Raw spreads and maximum leverage for high-volume professionals who demand institutional-grade conditions on every trade.',
    deposit: '$100,000',
    leverage: '1:500',
    spread: '0',
    swap: '0',
    minTrade: '0.01 lot',
    accent: 'from-accent-amber to-accent-rose',
    featured: false,
  },
]

const rows = [
  { label: 'Minimum Deposit', key: 'deposit' },
  { label: 'Leverage',        key: 'leverage' },
  { label: 'Spread',          key: 'spread' },
  { label: 'Swap',            key: 'swap' },
  { label: 'Minimum Trade',   key: 'minTrade' },
]

const Plans = () => {
  const [activePanel, setActivePanel] = useState(null)

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-darkBg">

      {/* Header */}
      <div className="px-6 pb-16 mx-auto text-center max-w-7xl md:px-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
            Investment Plans
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight font-display md:text-5xl text-neutral-900 dark:text-white">
            Select the Account That Fits{' '}
            <span className="text-primary-600 dark:text-primary-400">Your Trading Goals</span>
          </h1>
          <p className="max-w-2xl mx-auto font-sans text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            Whether you're taking your first position or managing a high-volume portfolio, every account tier is engineered to give you a decisive edge in the market.
          </p>
        </motion.div>
      </div>

      {/* Plan cards */}
      <div className="max-w-6xl px-6 mx-auto md:px-12 pb-28">
        <div className="grid items-stretch grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? 'border-primary-500 dark:border-primary-400 shadow-strong'
                  : 'border-neutral-200 dark:border-neutral-700 shadow-soft'
              } bg-white dark:bg-neutral-800`}
            >
              {/* Featured ribbon */}
              {plan.badge && (
                <div className="absolute flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white rounded-full top-4 right-4 bg-primary-600 font-display">
                  <StarRounded style={{ fontSize: 14 }} />
                  {plan.badge}
                </div>
              )}

              {/* Top accent bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${plan.accent}`} />

              {/* Card header */}
              <div className="px-8 pt-8 pb-6">
                <h2 className="mb-3 text-2xl font-bold font-display text-neutral-900 dark:text-white">{plan.name}</h2>
                <p className="font-sans text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{plan.description}</p>
              </div>

              {/* Divider */}
              <div className="mx-8 border-t border-neutral-100 dark:border-neutral-700" />

              {/* Specs */}
              <div className="flex-1 px-8 py-6 space-y-3">
                {rows.map((row, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{row.label}</span>
                    <span className="text-sm font-semibold font-display text-neutral-900 dark:text-white">{plan[row.key]}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-8 pb-8">
                <Link
                  to="/register"
                  className={`font-display w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-lg transition-colors duration-200 ${
                    plan.featured
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <TrendingUp fontSize="small" />
                  Get Started
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA section — shared with Markets */}
      <div className="overflow-hidden border-t border-neutral-200 dark:border-neutral-700">

        {/* CTA text */}
        <div className="px-6 bg-neutral-100 dark:bg-neutral-900 py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center mx-auto mb-6 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl">
              <Security className="text-white" fontSize="large" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white font-display md:text-4xl">
              Ready to Access Institutional-Grade Markets?
            </h2>
            <p className="mb-8 font-sans text-lg text-neutral-600 dark:text-neutral-400">
              Join thousands of traders who execute with precision, speed, and confidence every single day.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="font-display inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                <TrendingUp fontSize="small" />
                Get Started Free
              </Link>
              <Link
                to="/auth/user/login"
                className="font-display inline-flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-600 hover:border-primary-500 dark:hover:border-primary-400 text-neutral-800 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-white font-medium px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                Login to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  )
}

export default Plans
