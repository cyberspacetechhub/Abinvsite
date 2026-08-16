import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PersonAddAlt, AccountBalanceWallet, TrendingUp, FormatQuote, StarRounded } from '@mui/icons-material'
import testimonies from '../../utils/testimonies'

const steps = [
  {
    number: '01',
    icon: <PersonAddAlt fontSize="large" className="text-white" />,
    title: 'Create Account',
    body: 'Join us today and start building your investment portfolio with expert guidance, advanced tools, and a clear path toward long-term financial growth.',
    accent: 'from-primary-500 to-primary-700',
  },
  {
    number: '02',
    icon: <AccountBalanceWallet fontSize="large" className="text-white" />,
    title: 'First Deposit',
    body: 'Fund your account and instantly unlock a world of diversified opportunities — from forex and crypto to stocks and commodities — all within one secure platform.',
    accent: 'from-accent-emerald to-primary-600',
  },
  {
    number: '03',
    icon: <TrendingUp fontSize="large" className="text-white" />,
    title: 'Start Trading',
    body: 'Step into a seamless, high-performance trading environment built for consistent results. Execute with confidence across every major market, every single day.',
    accent: 'from-accent-purple to-primary-700',
  },
]

const GetStarted = () => {
  return (
    <div className="bg-white dark:bg-darkBg">

      {/* Steps header */}
      <div className="px-6 pb-16 mx-auto text-center max-w-7xl md:px-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
            Quick Setup
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight font-display md:text-5xl text-neutral-900 dark:text-white">
            Register in 5 Minutes With{' '}
            <span className="text-primary-600 dark:text-primary-400">3 Easy Steps</span>
          </h1>
          <p className="max-w-2xl mx-auto font-sans text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            No hassle, no waiting. Follow three straightforward steps and you're ready to trade with full access to global financial markets.
          </p>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="max-w-6xl px-6 mx-auto md:px-12 pb-28">
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-neutral-200 dark:bg-neutral-700 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${step.accent} flex items-center justify-center mb-6 shadow-medium`}>
                {step.icon}
              </div>

              {/* Step number */}
              <span className="mb-2 text-xs font-bold tracking-widest uppercase font-display text-primary-500 dark:text-primary-400">
                Step {step.number}
              </span>

              <h3 className="mb-3 text-xl font-bold font-display text-neutral-900 dark:text-white">{step.title}</h3>
              <p className="max-w-xs font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-14"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white transition-colors duration-200 rounded-lg font-display bg-primary-600 hover:bg-primary-700"
          >
            <PersonAddAlt fontSize="small" />
            Get Started Now
          </Link>
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="px-6 py-24 overflow-hidden border-t bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 md:px-12">
        <div className="mx-auto max-w-7xl">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
              Testimonials
            </span>
            <h2 className="mb-4 text-3xl font-bold font-display md:text-4xl text-neutral-900 dark:text-white">
              Trusted by Traders{' '}
              <span className="text-primary-600 dark:text-primary-400">Worldwide</span>
            </h2>
            <p className="max-w-xl mx-auto font-sans text-lg text-neutral-600 dark:text-neutral-400">
              Real results from real traders who've transformed their financial future on our platform.
            </p>
          </motion.div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonies.slice(0, 6).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col p-6 transition-shadow duration-300 bg-white border dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-soft hover:shadow-medium"
              >
                {/* Quote icon */}
                <FormatQuote className="absolute text-primary-200 dark:text-primary-800 top-4 right-4" style={{ fontSize: 40 }} />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <StarRounded key={s} className="text-accent-amber" style={{ fontSize: 18 }} />
                  ))}
                </div>

                <p className="flex-1 mb-6 font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  "{t.testimony}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700">
                    <span className="text-sm font-bold text-white font-display">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-display text-neutral-900 dark:text-white">{t.name}</p>
                    <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default GetStarted
