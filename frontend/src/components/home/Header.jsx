import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthProvider'
import { useTheme } from '../../context/ThemeContext'

const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/about',       label: 'Our Story' },
  { to: '/services',    label: 'Services' },
  { to: '/support',     label: 'Support' },
]

const Header = () => {
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [showNav, setShowNav] = useState(false)

  const handleShowNav = () => setShowNav(prev => !prev)

  const linkClass = (path) =>
    location.pathname === path
      ? 'font-display font-semibold text-base text-primary-600 dark:text-primary-400 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full'
      : 'font-display font-medium text-base text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:rounded-full after:transition-all after:duration-300 hover:after:w-full'

  return (
    <div>
      <div className="fixed top-0 z-50 w-full border-b backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-neutral-200/40 dark:border-neutral-700/40">
        <header className="px-4 md:px-12">
          <nav>
            <div className="flex items-center justify-between py-3">

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img src="/semlogo.png" alt="Stock Exchange Mining" className="w-auto h-11" />
              </Link>

              {/* Desktop nav */}
              <div className="items-center hidden lg:flex gap-7">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* Right actions */}
              <div className="items-center hidden gap-3 lg:flex">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 transition-colors duration-200 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
                </button>

                {auth?.user || auth?.company ? (
                  <button
                    onClick={() => navigate(auth.user?.type === 'Client' ? '/user' : '/')}
                    className="font-display inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Dashboard
                  </button>
                ) : (
                  <Link
                    to="/auth/user/login"
                    className="font-display inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    Client Portal
                  </Link>
                )}
              </div>

              {/* Mobile right */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 transition-colors duration-200 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  {isDarkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
                </button>
                <button
                  onClick={handleShowNav}
                  className="p-2 transition-colors duration-200 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  {showNav ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                  )}
                </button>
              </div>

            </div>

            {/* Mobile menu */}
            {showNav && (
              <div className="flex flex-col gap-4 pt-2 pb-6 border-t lg:hidden border-neutral-200 dark:border-neutral-700">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} onClick={handleShowNav} className={linkClass(l.to)}>
                    {l.label}
                  </Link>
                ))}
                <div className="pt-2">
                  {auth?.user || auth?.company ? (
                    <button
                      onClick={() => { navigate(auth.user?.type === 'Client' ? '/user' : '/'); handleShowNav() }}
                      className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200"
                    >
                      Dashboard
                    </button>
                  ) : (
                    <Link
                      to="/auth/user/login"
                      onClick={handleShowNav}
                      className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200"
                    >
                      Client Portal
                    </Link>
                  )}
                </div>
              </div>
            )}
          </nav>
        </header>
      </div>


    </div>
  )
}

export default Header
