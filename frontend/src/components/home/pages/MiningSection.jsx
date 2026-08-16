import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Diamond, BoltOutlined, TrendingUp, AccountBalanceWallet,
  ShieldOutlined, BarChartOutlined, ArrowForward, CheckCircleRounded
} from '@mui/icons-material'

const features = [
  {
    icon: Diamond,
    title: 'Real Gold Mining Operations',
    body: 'Access professionally managed gold mining operations running 24/7 — no equipment, no logistics, no maintenance.',
    accent: 'from-yellow-500 to-amber-700',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: BoltOutlined,
    title: 'Instant Activation',
    body: 'Purchase a rig and it starts earning immediately. Rewards accumulate in your Gold Mining Account in real time.',
    accent: 'from-amber-500 to-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: BarChartOutlined,
    title: 'Live Earnings Dashboard',
    body: 'Track mining rate, uptime, and total earned directly from your dashboard. Full transparency on every dollar earned.',
    accent: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: AccountBalanceWallet,
    title: 'Dedicated Gold Mining Balance',
    body: 'All gold mining rewards land in a separate Gold Mining Account, keeping your trading and funding balances clean.',
    accent: 'from-yellow-500 to-primary-700',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    icon: TrendingUp,
    title: 'Flexible Rig Tiers',
    body: 'From entry-level rigs to high-performance operations — choose the mining capacity that matches your investment appetite.',
    accent: 'from-primary-500 to-primary-700',
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    color: 'text-primary-600 dark:text-primary-400',
  },
  {
    icon: ShieldOutlined,
    title: 'Zero Technical Risk',
    body: 'Equipment costs, operations, and logistics are all handled by us. You earn — we manage the infrastructure.',
    accent: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    color: 'text-rose-600 dark:text-rose-400',
  },
]

const highlights = [
  'No equipment to buy or manage',
  'Start earning from day one',
  'Withdraw earnings anytime',
  'Multiple rig tiers available',
  'Runs 24 / 7 automatically',
  'Fully managed operations',
]

const MiningSection = () => {
  return (
    <section className="w-full bg-white dark:bg-darkBg border-t border-neutral-200 dark:border-neutral-800">

      {/* ── Hero band ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-amber-950 to-neutral-900 py-24 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-yellow-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-display font-semibold text-sm tracking-wide">
              <Diamond style={{ fontSize: 16 }} /> Gold Mining
            </span>

            <h2 className="mb-6 text-4xl font-bold leading-tight font-display md:text-5xl text-white">
              Mine Gold While You{' '}
              <span className="text-amber-400">Sleep</span>
            </h2>

            <p className="max-w-2xl mx-auto font-sans text-lg leading-relaxed text-neutral-300 mb-10">
              We've built a fully managed gold mining platform right inside your dashboard. Rent a rig, hit start, and watch your Gold Mining Account grow — no technical knowledge required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="font-display inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                <Diamond fontSize="small" /> Start Mining Now
              </Link>
              <Link
                to="/auth/user/login"
                className="font-display inline-flex items-center gap-2 border border-white/30 hover:border-white text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                Login to Dashboard <ArrowForward fontSize="small" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
            How It Works
          </span>
          <h3 className="text-3xl font-bold font-display md:text-4xl text-neutral-900 dark:text-white mb-4">
            Everything You Need,{' '}
            <span className="text-primary-600 dark:text-primary-400">Nothing You Don't</span>
          </h3>
          <p className="max-w-xl mx-auto font-sans text-base text-neutral-600 dark:text-neutral-400">
            Our gold mining platform is designed to be powerful for experts and effortless for beginners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="relative flex flex-col p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4 self-start`}>
                  <Icon className={f.color} />
                </div>
                <h4 className="mb-2 text-base font-bold font-display text-neutral-900 dark:text-white">{f.title}</h4>
                <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{f.body}</p>
                <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-3xl rounded-br-2xl bg-gradient-to-br ${f.accent} opacity-5`} />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Split CTA ── */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-display font-semibold text-sm tracking-wide">
              Why Choose Our Gold Mining
            </span>
            <h3 className="mb-6 text-3xl font-bold font-display md:text-4xl text-neutral-900 dark:text-white leading-snug">
              Passive Income,{' '}
              <span className="text-amber-600 dark:text-amber-400">Active Returns</span>
            </h3>
            <p className="mb-8 font-sans text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              Traditional gold mining requires expensive equipment, technical expertise, and constant operations. Our platform removes every barrier — you get all the upside with none of the overhead.
            </p>
            <ul className="space-y-3">
              {highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircleRounded className="text-amber-500 dark:text-amber-400 flex-shrink-0" style={{ fontSize: 20 }} />
                  <span className="font-sans text-sm text-neutral-700 dark:text-neutral-300">{h}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right — visual card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-600 via-amber-700 to-orange-800 p-8 text-white shadow-strong">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Diamond className="text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm">Gold Mining Dashboard</p>
                    <p className="font-sans text-xs text-amber-200">Live earnings tracker</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Active Rigs', value: '3' },
                    { label: 'Total Earned', value: '$1,284.50' },
                    { label: 'Avg. Daily Rate', value: '$42.80' },
                    { label: 'Uptime', value: '99.8%' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-3">
                      <p className="font-sans text-xs text-amber-200 mb-1">{stat.label}</p>
                      <p className="font-display font-bold text-lg">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display text-sm font-semibold">Gold Rig Pro X1</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold">Running</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-amber-200">
                    <span>High Capacity</span>
                    <span>+$18.40 today</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/20">
                    <div className="h-full w-4/5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}

export default MiningSection
