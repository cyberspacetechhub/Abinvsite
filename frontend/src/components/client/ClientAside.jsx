import { Dashboard, History, Person, WalletOutlined, TrendingUp, ExitToApp, DarkModeOutlined, LightModeOutlined, Memory, ArrowUpward } from '@mui/icons-material'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthContext from '../../context/AuthProvider'
import Logout from '../auth/Logout'
import { useTheme } from '../../context/ThemeContext'
import { useTranslation } from 'react-i18next'

const navItems = [
  { path: '/user',                    icon: Dashboard,     labelKey: 'navigation.dashboard', exact: true },
  { path: '/user/transactions',       icon: History,       labelKey: 'navigation.transactions'             },
  { path: '/user/investments',        icon: TrendingUp,    labelKey: 'navigation.investment'               },
  { path: '/user/investmentplan',     icon: WalletOutlined,labelKey: 'navigation.plans'                    },
  { path: '/user/mining',             icon: Memory,        labelKey: 'navigation.mining'                   },
  { path: '/user/withdraw-flow',      icon: ArrowUpward,   labelKey: 'navigation.withdraw'                 },
]

const ClientAside = ({ aside, setAside }) => {
  const location = useLocation()
  const { auth } = useContext(AuthContext)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && aside) {
        setAside(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [aside, setAside])

  const handleToggleAside = useCallback(() => setAside(prev => !prev), [setAside])
  const handleOpenModal  = useCallback(() => setOpenModal(true), [])
  const handleCloseModal = useCallback(() => setOpenModal(false), [])

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname === path

  const linkClass = (active) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
      active
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
    }`

  const iconClass = (active) =>
    `w-5 h-5 mr-3 transition-colors duration-200 ${
      active
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
    }`

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-40 w-72 h-screen pt-16 transition-transform bg-white border-r border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700 md:translate-x-0 ${
        aside ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Client Navigation"
    >
      <div className="h-full px-4 py-6 overflow-y-auto flex flex-col">

        {/* Balance Widget */}
        <div className="p-4 mb-6 text-white rounded-xl bg-gradient-to-br from-primary-600 to-primary-800">
          <p className="mb-3 text-xs font-semibold tracking-wider uppercase font-display text-primary-200">
            {t('dashboard.accountOverview')}
          </p>
          <div className="mb-3 space-y-1">
            <p className="text-2xl font-bold font-display">
              ${(auth?.user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-sm font-normal text-primary-200">USD</span>
            </p>
            <p className="font-sans text-sm text-primary-200">
              £{((auth?.user?.balance || 0) * 0.79).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-xs">GBP</span>
            </p>
          </div>

          <div className="pt-3 mb-3 space-y-2 border-t border-primary-500">
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs text-primary-200">{t('dashboard.profitBalance')}</p>
              <p className="text-sm font-semibold font-display text-emerald-300">
                +${(auth?.user?.profitBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs text-primary-200">{t('dashboard.totalDeposits')}</p>
              <p className="text-sm font-semibold font-display text-amber-300">
                ${(auth?.user?.depositInOrders || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/user/deposit-flow"
              onClick={handleToggleAside}
              className="py-2 text-xs font-semibold text-center transition-colors duration-200 rounded-lg font-display bg-white/20 hover:bg-white/30"
            >
              + {t('navigation.deposit')}
            </Link>
            <Link
              to="/user/withdraw-flow"
              onClick={handleToggleAside}
              className="py-2 text-xs font-semibold text-center transition-colors duration-200 rounded-lg font-display bg-white/20 hover:bg-white/30"
            >
              − {t('navigation.withdraw')}
            </Link>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            return (
              <Link key={item.path} to={item.path} onClick={handleToggleAside} className={linkClass(active)}>
                <Icon className={iconClass(active)} />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          })}

          {/* Profile */}
          {(() => {
            const active = isActive(`/user/profile/${auth?.user?._id}`)
            return (
              <Link to={`/user/profile/${auth?.user?._id}`} onClick={handleToggleAside} className={linkClass(active)}>
                <Person className={iconClass(active)} />
                <span>{t('navigation.profile')}</span>
                {!auth?.user?.isVerified && (
                  <span className="w-2 h-2 ml-auto bg-red-500 rounded-full" />
                )}
              </Link>
            )
          })()}
        </nav>

        {/* Bottom */}
        <div className="pt-6 mt-6 space-y-1 border-t border-gray-200 dark:border-gray-700">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              {isDarkMode
                ? <LightModeOutlined className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                : <DarkModeOutlined className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              }
              <span>{t('navigation.settings')}</span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${isDarkMode ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleOpenModal}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 group"
          >
            <ExitToApp className="w-5 h-5 mr-3 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
            <span>{t('auth.logout')}</span>
          </button>
        </div>

      </div>

      <Logout open={openModal} handleClose={handleCloseModal} />
    </aside>
  )
}

export default ClientAside
