import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import LoginIcon from '@mui/icons-material/Login'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import BoltIcon from '@mui/icons-material/Bolt'
import GroupsIcon from '@mui/icons-material/Groups'

const HeroSection = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const items = [
    { icon: <MoneyOffIcon className="text-primary-400" />, title: 'Zero Commission Trading', sub: 'Every dollar of profit stays in your pocket' },
    { icon: <PublicIcon className="text-primary-400" />, title: 'Global Market Access', sub: '500+ assets spanning crypto, forex & commodities' },
    { icon: <LockIcon className="text-primary-400" />, title: 'Bank-Grade Security', sub: 'Cold-storage custody with real-time fraud detection' },
    { icon: <BoltIcon className="text-primary-400" />, title: 'Institutional Execution', sub: 'Sub-millisecond order fills across 30+ global venues' },
    { icon: <GroupsIcon className="text-primary-400" />, title: '200,000+ Investors Trust Us', sub: 'Join a global community building lasting wealth' },
  ]

  const stats = [
    { value: '10+',   label: 'Years in the Market' },
    { value: '200K+', label: 'Active Investors' },
    { value: '150+',  label: 'Countries Served' },
    { value: '99.9%', label: 'Platform Uptime' },
  ]

  return (
    <>

      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <section className="relative flex items-center justify-center w-full min-h-screen overflow-hidden">
        {/* Background image — switches with dark mode */}
        <img
          src={isDark ? '/sembanner.png' : '/sembanner.png'}
          alt="Hero background"
          className="absolute inset-0 object-cover object-center w-full h-full"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-neutral-900/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white font-display sm:text-5xl md:text-6xl">
            Your Wealth Deserves a{' '}
            <span className="text-primary-400">Smarter Strategy</span>
          </h1>

          <p className="max-w-xl mb-10 font-sans text-lg text-neutral-300">
            Stock Exchange Mining gives every investor — from first-timers to seasoned professionals — the tools, intelligence, and infrastructure to grow capital with confidence.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="font-display inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base px-8 py-3.5 rounded-lg transition-colors duration-200"
            >
              <PersonAddAltIcon fontSize="small" />
              Sign Up
            </Link>

            <Link
              to="/auth/user/login"
              className="font-display inline-flex items-center gap-2 border border-white/40 hover:border-white text-white hover:bg-white/10 font-medium text-base px-8 py-3.5 rounded-lg transition-colors duration-200"
            >
              <LoginIcon fontSize="small" />
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="w-full py-4 overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-y border-neutral-300 dark:border-neutral-700">
        <div className="marquee-track">
          {[...Array(2)].map((_, gi) => (
            <div key={gi} className="flex items-stretch gap-0">
              {items.map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-3 px-10 whitespace-nowrap">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold font-display text-neutral-900 dark:text-white">{item.title}</p>
                      <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">{item.sub}</p>
                    </div>
                  </div>
                  <span className="text-lg select-none text-neutral-300 dark:text-neutral-600">|</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full py-6 bg-neutral-200 dark:bg-neutral-800">
        <div className="flex flex-wrap justify-center gap-8 px-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold font-display text-primary-600 dark:text-primary-400">{s.value}</p>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default HeroSection
