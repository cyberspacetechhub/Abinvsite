import { Call, Email, FacebookRounded, Instagram, Warning, YouTube, AccountBalance, CreditCard } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TetherLogo from '../../assets/image/Tether.png'
import BnbLogo from '../../assets/image/bnb.png'
import BtcLogo from '../../assets/image/bitcoin-logo.png'
import EthLogo from '../../assets/image/ethereum-2048x428.png'
import LitecoinLogo from '../../assets/image/litecoin_logo.png'
import MastercardLogo from '../../assets/image/mastercard3-e1698396352455.png'
import Blog from './pages/Blog'

const methods = [
  { label: 'Bitcoin',      logo: BtcLogo,       type: 'img' },
  { label: 'Ethereum',     logo: EthLogo,        type: 'img' },
  { label: 'Tether USDT',  logo: TetherLogo,     type: 'img' },
  { label: 'BNB',          logo: BnbLogo,        type: 'img' },
  { label: 'Litecoin',     logo: LitecoinLogo,   type: 'img' },
  { label: 'Mastercard',   logo: MastercardLogo, type: 'img' },
  { label: 'Bank Transfer', logo: null,          type: 'icon', icon: <AccountBalance style={{ fontSize: 20 }} /> },
  { label: 'Wire Transfer', logo: null,          type: 'icon', icon: <CreditCard style={{ fontSize: 20 }} /> },
  { label: 'XRP / Ripple', logo: null,           type: 'text', text: 'XRP' },
  { label: 'Solana',       logo: '/solana.png',  type: 'img' },
]

const Footer = () => {
  return (
    <div className="text-neutral-600 dark:text-neutral-300">

      {/* Payment methods marquee */}
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="px-5 py-12 text-center"
        >
          <h2 className="mb-3 text-4xl font-bold font-display md:text-5xl text-neutral-900 dark:text-white">
            Accepted <span className="text-primary-600 dark:text-primary-400">Payment Methods</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
            Fund your account securely using any of our supported deposit channels
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="py-4 overflow-x-hidden border-y border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <style>{`
            .payment-track {
              display: flex;
              width: max-content;
              animation: payment-scroll 30s linear infinite;
            }
            .payment-track:hover { animation-play-state: paused; }
            @keyframes payment-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div className="payment-track">
            {[...Array(2)].map((_, gi) => (
              <div key={gi} className="flex items-center gap-3 px-3">
                {methods.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-soft whitespace-nowrap hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200 cursor-default"
                  >
                    {m.type === 'img' && (
                      <img src={m.logo} alt={m.label} className="object-contain w-auto h-5" />
                    )}
                    {m.type === 'icon' && (
                      <span className="text-primary-600 dark:text-primary-400">{m.icon}</span>
                    )}
                    {m.type === 'text' && (
                      <span className="text-sm font-bold font-display text-neutral-800 dark:text-neutral-200">{m.text}</span>
                    )}
                    <span className="font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog section */}
      <div>
        <Blog />
      </div>

      {/* Main footer */}
      <footer className="pt-16 mt-20 text-white bg-gradient-to-br from-neutral-900 to-neutral-800">
        <div className="px-6 mx-auto max-w-7xl md:px-12">
          <div className="grid grid-cols-1 gap-8 pb-16 md:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <img src="/semlogo.png" alt="Stock Exchange Mining" className="w-auto h-12" />
              </div>
              <p className="max-w-md mb-6 text-lg leading-relaxed text-neutral-300">
                Empowering traders worldwide with cutting-edge AI technology, real-time market analytics, and
                institutional-grade execution across cryptocurrency, forex, and global financial markets.
              </p>
              <div className="flex space-x-3">
                {[FacebookRounded, Instagram, YouTube].map((Icon, i) => (
                  <a key={i} href="#" className="flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-lg bg-neutral-700 hover:bg-primary-600">
                    <Icon className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="mb-6 text-lg font-bold text-white font-display">Explore</h3>
              <div className="space-y-3">
                {[
                  { to: '/about',          label: 'Our Story' },
                  { to: '/services',       label: 'Trading Solutions' },
                  { to: '/privacy-policy', label: 'Privacy & Security' },
                ].map((l, i) => (
                  <Link key={i} to={l.to} className="block font-sans transition-colors duration-200 text-neutral-400 hover:text-primary-400">{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Get Started */}
            <div>
              <h3 className="mb-6 text-lg font-bold text-white font-display">Get Started</h3>
              <div className="space-y-3">
                {[
                  { to: '/auth/user/login', label: 'Access Account' },
                  { to: '/register',        label: 'Start Trading' },
                  { to: '/user',            label: 'Trading Dashboard' },
                  { to: '/support',         label: '24/7 Support' },
                ].map((l, i) => (
                  <Link key={i} to={l.to} className="block font-sans transition-colors duration-200 text-neutral-400 hover:text-primary-400">{l.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Risk disclosure */}
          <div className="pt-8 border-t border-neutral-700">
            <div className="p-6 mb-8 border bg-amber-500/10 border-amber-500/20 rounded-xl">
              <h4 className="inline-flex items-center gap-2 mb-3 text-base font-bold text-amber-400 font-display">
                <Warning fontSize="small" />
                Risk Disclosure
              </h4>
              <p className="font-sans text-sm leading-relaxed text-neutral-400">
                Cryptocurrency and forex trading involves significant risk of loss. Market volatility can result in substantial gains or losses.
                Our AI systems and analytics are tools to assist decision-making but do not guarantee profits. Trade responsibly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-6 border-t border-neutral-700 md:px-12">
          <div className="flex flex-col items-center justify-between gap-4 mx-auto max-w-7xl md:flex-row">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex items-center gap-2 font-sans text-sm text-neutral-400">
                <Call className="text-primary-400" fontSize="small" />
                <Link to='https://wa.me/447393153454' className="p-2 bg-green-600 text-white hover:bg-green-800 rounded-md">Whatsapp</Link>
              </div>
              <div className="flex items-center gap-2 font-sans text-sm text-neutral-400">
                <Email className="text-primary-400" fontSize="small" />
                <a href="mailto:support@stockexchangemining.com" className="transition-colors duration-200 hover:text-primary-400">
                  support@stockexchangemining.com
                </a>
              </div>
            </div>
            <p className="font-sans text-sm text-neutral-500">
              © 2022 – {new Date().getFullYear()} Stock Exchange Mining. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
