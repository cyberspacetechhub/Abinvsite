import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Shield, Groups, EmojiEvents,
  CheckCircleRounded, ArrowForward, Public,
  LightbulbOutlined, HandshakeOutlined, VerifiedOutlined
} from '@mui/icons-material'

const heroImg   = 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=2070&q=80'
const globeImg  = 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2070&q=80'

const team = [
  { img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', name: 'Sabina Goodwin',  role: 'Head of Market Intelligence'   },
  { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', name: 'Harvey Jake',     role: 'Senior Forex Strategist'       },
  { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', name: 'Bonnie Andres',   role: 'Portfolio Risk Manager'        },
  { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', name: 'Kalil Ahmed',     role: 'AI & Quantitative Systems Lead' },
]

const stats = [
  { value: '2015',   label: 'Founded'          },
  { value: '200K+',  label: 'Active Investors' },
  { value: '150+',   label: 'Countries Served' },
  { value: '$2B+',   label: 'Volume Traded'    },
  { value: '99.9%',  label: 'Platform Uptime'  },
  { value: '24 / 7', label: 'Support Coverage' },
]

const values = [
  { icon: LightbulbOutlined, title: 'Innovation',  body: 'We relentlessly push the boundaries of financial technology — building tools that hand every investor the same edge once reserved for institutional desks.' },
  { icon: Shield,            title: 'Security',    body: 'Military-grade encryption, cold-storage custody, and 24/7 fraud monitoring ensure your capital is protected at every layer.' },
  { icon: HandshakeOutlined, title: 'Integrity',   body: 'No hidden fees, no misleading projections. We earn long-term trust by being completely straightforward about everything we do.' },
  { icon: VerifiedOutlined,  title: 'Excellence',  body: 'From order execution speed to post-trade support, every touchpoint on our platform is held to the highest professional standard.' },
]

const milestones = [
  { year: '2013', title: 'The Idea',           body: 'Our founders — early Bitcoin adopters and former institutional traders — saw a clear gap: retail investors deserved far better tools.' },
  { year: '2015', title: 'Platform Launch',    body: 'Stock Exchange Mining went live with forex and crypto trading, welcoming its first 1,000 investors within 90 days of launch.' },
  { year: '2018', title: 'AI Integration',     body: 'We introduced proprietary AI-driven signal generation and automated portfolio rebalancing, setting a new industry benchmark.' },
  { year: '2021', title: 'Global Expansion',   body: 'Operations expanded to 150+ countries. We surpassed 100,000 active investors and $1B in cumulative trading volume.' },
  { year: '2023', title: 'Gold Mining Launch', body: 'Launched our fully managed gold mining platform, opening a new passive income stream for investors worldwide.' },
  { year: '2025', title: 'Today',              body: 'Serving 200,000+ investors across 150+ countries with a complete suite of trading, investment, and gold mining products.' },
]

const whyUs = [
  'Real-time crypto, forex & commodities analysis',
  'AI-powered trading signals and automation',
  'Multi-asset portfolio management',
  'Fully managed gold mining operations',
  'Dedicated 24 / 7 investor support',
  'Transparent, regulated operations',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay },
})

const About = () => (
  <div className="bg-white dark:bg-darkBg pt-20">

    {/* ── Breadcrumb ── */}
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Home</Link>
        <span className="text-neutral-400">/</span>
        <span className="text-neutral-600 dark:text-neutral-300 font-medium">About Us</span>
      </nav>
    </div>

    {/* SECTION 1 — Hero */}
    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 py-28 px-6">
      <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-primary-900/60 to-neutral-900/80" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />

      <motion.div {...fadeUp()} className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block mb-5 px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 font-display font-semibold text-sm tracking-wide">
          Our Story
        </span>
        <h1 className="mb-6 text-4xl md:text-6xl font-bold font-display text-white leading-tight">
          Built by Investors,{' '}
          <span className="text-primary-400">For Investors</span>
        </h1>
        <p className="max-w-2xl mx-auto font-sans text-lg text-neutral-300 leading-relaxed mb-10">
          Since 2015, Stock Exchange Mining has pursued one mission — to give every investor, regardless of background or capital size, access to the same tools and opportunities that institutional traders have always enjoyed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="font-display inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200">
            Join Us Today <ArrowForward fontSize="small" />
          </Link>
          <Link to="/services" className="font-display inline-flex items-center gap-2 border border-white/30 hover:border-white text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-lg transition-colors duration-200">
            Our Services
          </Link>
        </div>
      </motion.div>
    </div>

    {/* SECTION 2 — Stats bar */}
    <div className="bg-primary-600 dark:bg-primary-700">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} {...fadeUp(i * 0.07)} className="text-center">
            <p className="text-2xl font-bold font-display text-white">{s.value}</p>
            <p className="mt-1 text-xs font-sans text-primary-200 uppercase tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* SECTION 3 — Mission & Vision */}
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div {...fadeUp()}>
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
          Mission & Vision
        </span>
        <h2 className="mb-6 text-3xl md:text-4xl font-bold font-display text-neutral-900 dark:text-white leading-snug">
          Levelling the Playing Field in{' '}
          <span className="text-primary-600 dark:text-primary-400">Global Financial Markets</span>
        </h2>
        <p className="mb-5 font-sans text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          Our mission is clear: dismantle every barrier standing between ambitious investors and the markets they want to participate in. We do this through technology, radical transparency, and an unwavering commitment to investor outcomes.
        </p>
        <p className="mb-8 font-sans text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          Our vision is a world where geography, starting capital, and technical knowledge are no longer gatekeepers to financial opportunity. Every feature we build and every product we launch moves us closer to that reality.
        </p>
        <ul className="space-y-3">
          {whyUs.map((item, i) => (
            <motion.li key={i} {...fadeUp(i * 0.06)} className="flex items-center gap-3">
              <CheckCircleRounded className="text-primary-500 flex-shrink-0" style={{ fontSize: 20 }} />
              <span className="font-sans text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div {...fadeUp(0.15)} className="relative rounded-2xl overflow-hidden shadow-strong">
        <img src={globeImg} alt="Global reach" className="w-full h-full object-cover" style={{ minHeight: 420 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
              <Public className="text-white" fontSize="small" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Truly Global</p>
              <p className="font-sans text-xs text-white/70">Active investors in 150+ countries across 6 continents</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    {/* SECTION 4 — Core Values */}
    <div className="bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
            Core Values
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            The Standards That{' '}
            <span className="text-primary-600 dark:text-primary-400">Define Everything We Do</span>
          </h2>
          <p className="max-w-xl mx-auto font-sans text-base text-neutral-600 dark:text-neutral-400">
            These aren't values on a slide deck. They're the commitments we hold ourselves to every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <Icon className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mb-2 font-display font-bold text-neutral-900 dark:text-white">{v.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{v.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>

    {/* SECTION 5 — Timeline */}
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-24">
      <motion.div {...fadeUp()} className="text-center mb-16">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
          Our Journey
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-4">
          Ten Years of{' '}
          <span className="text-primary-600 dark:text-primary-400">Milestones</span>
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700 md:left-1/2" />
        <div className="space-y-10">
          {milestones.map((m, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)}
              className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-primary-600 border-2 border-white dark:border-neutral-900 -translate-x-1/2 mt-1.5 z-10" />
              <div className="hidden md:block md:w-1/2" />
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 shadow-soft">
                  <span className="inline-block mb-2 px-3 py-0.5 rounded-full bg-primary-600 text-white font-display font-bold text-xs">{m.year}</span>
                  <h3 className="font-display font-bold text-neutral-900 dark:text-white mb-1">{m.title}</h3>
                  <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{m.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* SECTION 6 — Team */}
    <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-display font-semibold text-sm tracking-wide">
            Leadership Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            The People{' '}
            <span className="text-primary-600 dark:text-primary-400">Behind the Platform</span>
          </h2>
          <p className="max-w-xl mx-auto font-sans text-base text-neutral-600 dark:text-neutral-400">
            Decades of combined experience across institutional finance, quantitative research, and financial technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}
              className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              </div>
              <div className="p-5">
                <p className="font-display font-bold text-neutral-900 dark:text-white">{member.name}</p>
                <p className="mt-0.5 font-sans text-sm text-primary-600 dark:text-primary-400">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* SECTION 7 — CTA */}
    <div className="bg-gradient-to-br from-primary-600 to-primary-900 py-20 px-6">
      <motion.div {...fadeUp()} className="max-w-3xl mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
          <EmojiEvents className="text-white" fontSize="large" />
        </div>
        <h2 className="mb-4 text-3xl md:text-4xl font-bold font-display text-white leading-snug">
          Ready to Write Your Own Chapter?
        </h2>
        <p className="mb-8 font-sans text-lg text-primary-200 max-w-xl mx-auto">
          Join over 200,000 investors who chose Stock Exchange Mining as their platform for trading, growing, and protecting wealth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="font-display inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200">
            Open a Free Account <ArrowForward fontSize="small" />
          </Link>
          <Link to="/auth/user/login" className="font-display inline-flex items-center gap-2 border border-white/40 hover:border-white text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-lg transition-colors duration-200">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>

  </div>
)

export default About
