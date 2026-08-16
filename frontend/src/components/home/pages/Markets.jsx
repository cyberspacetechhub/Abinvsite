import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircleRounded, TrendingUp, AccountBalance, AutoGraph, Security, FlashOn, BarChart, Shield } from '@mui/icons-material'

const img1 = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'
const img2 = 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?auto=format&fit=crop&w=1200&q=80'

const sections = [
  {
    tag: 'Algorithmic Execution',
    title: 'Trade Smarter With Fully Automated Order Routing',
    body: 'Our proprietary execution engine routes every order through the most optimal liquidity path in real time — eliminating slippage, reducing latency to sub-millisecond levels, and ensuring best-price fills across all connected venues. No manual intervention, no delays.',
    points: [
      'Sub-millisecond order execution across 30+ liquidity venues',
      'Smart order routing with real-time price aggregation',
      'Zero requotes — guaranteed fill at quoted price',
      'Automated risk controls with dynamic position sizing',
    ],
    image: img1,
    imageRight: true,
    icon: <AutoGraph fontSize="large" className="text-white" />,
    accent: 'from-primary-500 to-primary-700',
  },
  {
    tag: 'Multi-Asset Access',
    title: 'One Platform. Every Market That Matters.',
    body: 'From spot crypto and perpetual futures to major forex pairs and global indices — access deep institutional liquidity across every asset class through a single unified account. Our infrastructure connects directly to tier-one prime brokers and top-tier crypto exchanges.',
    points: [
      '500+ instruments across crypto, forex, indices and commodities',
      'Direct market access with institutional-grade spreads',
      'Unified margin across all asset classes',
      'Real-time P&L tracking and multi-currency settlement',
    ],
    image: img2,
    imageRight: false,
    icon: <AccountBalance fontSize="large" className="text-white" />,
    accent: 'from-accent-purple to-primary-700',
  },
]

const ctaBg = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80'

const ctaPanels = [
  {
    icon: <FlashOn fontSize="large" />,
    title: 'Lightning Execution',
    body: 'Sub-millisecond order routing across 30+ global liquidity venues. Every trade filled at the best available price with zero requotes.',
  },
  {
    icon: <BarChart fontSize="large" />,
    title: 'Deep Market Access',
    body: '500+ instruments spanning crypto, forex, indices and commodities — all accessible from one unified account with institutional spreads.',
  },
  {
    icon: <Shield fontSize="large" />,
    title: 'Fortress Security',
    body: 'Military-grade encryption, cold storage custody, and real-time fraud detection protect every position and every dollar you trade.',
  },
]

const Markets = () => {
  const [activePanel, setActivePanel] = useState(null)

  return (
    <div className="pt-20 overflow-hidden bg-white dark:bg-darkBg">

      {/* Breadcrumb */}
      {/* <div className="px-6 pb-10 md:px-12">
        <nav className="flex items-center space-x-2 text-sm">
          <Link to="/" className="font-medium transition-colors duration-200 text-primary-600 hover:text-primary-700">Home</Link>
          <span className="text-neutral-400">/</span>
          <span className="font-medium text-neutral-600 dark:text-neutral-300">Markets</span>
        </nav>
      </div> */}

      {/* Page header */}
      <div className="px-6 pb-16 mx-auto text-center max-w-7xl md:px-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
            Global Financial Markets
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight font-display md:text-5xl text-neutral-900 dark:text-white">
            Precision Access to{' '}
            <span className="text-primary-600 dark:text-primary-400">Global Financial Markets</span>
          </h1>
          <p className="max-w-3xl mx-auto font-sans text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            We provide institutional-grade access and execution capabilities across global financial markets,
            managed entirely by our proprietary automated infrastructure.
          </p>
        </motion.div>
      </div>

      {/* Alternating sections */}
      <div className="px-6 mx-auto max-w-7xl md:px-12 space-y-28 pb-28">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center`}
          >
            <div className={`relative ${!s.imageRight ? 'lg:order-2' : ''}`}>
              <div className="relative overflow-hidden rounded-2xl shadow-strong">
                <img src={s.image} alt={s.title} className="object-cover w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
              </div>
              <div className={`absolute -bottom-5 ${s.imageRight ? 'left-4' : 'right-4'} w-16 h-16 bg-gradient-to-br ${s.accent} rounded-2xl flex items-center justify-center shadow-medium`}>
                {s.icon}
              </div>
            </div>

            <div className={`space-y-6 ${!s.imageRight ? 'lg:order-1' : ''}`}>
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display">
                {s.tag}
              </span>
              <h2 className="text-3xl font-bold leading-tight font-display md:text-4xl text-neutral-900 dark:text-white">
                {s.title}
              </h2>
              <p className="font-sans text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                {s.body}
              </p>
              <ul className="space-y-3">
                {s.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircleRounded className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-neutral-700 dark:text-neutral-300">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="font-display inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors duration-200"
                >
                  <TrendingUp fontSize="small" />
                  Sign Up Now
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="overflow-hidden border-t border-neutral-200 dark:border-neutral-700">

        {/* Three-panel image strip — one shared bg image */}
        <div className="relative flex flex-col md:flex-row md:h-[480px] overflow-hidden">
          {/* Single shared background image */}
          <img
            src={ctaBg}
            alt="Markets background"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-neutral-900/65" />

          {ctaPanels.map((panel, i) => (
            <div
              key={i}
              onMouseEnter={() => setActivePanel(i)}
              onMouseLeave={() => setActivePanel(null)}
              className="relative z-10 flex flex-col justify-center flex-1 px-8 py-12 transition-all duration-500 cursor-pointer md:py-0 md:px-10"
              style={{ background: activePanel === i ? 'rgba(37,99,235,0.18)' : 'transparent' }}
            >
              {/* Vertical divider */}
              {i < ctaPanels.length - 1 && (
                <div className="hidden md:block absolute top-8 right-0 w-px h-[calc(100%-4rem)] bg-white/20" />
              )}

              <div className={`text-primary-400 mb-4 transition-transform duration-300 ${activePanel === i ? 'scale-110' : 'scale-100'}`}>
                {panel.icon}
              </div>
              <h3 className="mb-1 text-xl font-bold text-white font-display">{panel.title}</h3>

              {/* Body reveals on hover */}
              <div className={`overflow-hidden transition-all duration-500 ${activePanel === i ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <p className="font-sans text-sm leading-relaxed text-neutral-300">{panel.body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}

export default Markets
