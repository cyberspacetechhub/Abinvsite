import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Visibility, VisibilityOff, LightModeOutlined, DarkModeOutlined, LoginOutlined } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AuthContext from '../../context/AuthProvider'
import { useTheme } from '../../context/ThemeContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import LoginAttempts from './LoginAttempts'
import baseURL from '../../shared/baseURL'

const SignIn = ({ open, handleCloseLogin }) => {
  const { t } = useTranslation()
  const { auth, setAuth, persist, setPersist } = useContext(AuthContext)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockUntil, setLockUntil] = useState(null)

  const isStandalonePage = location.pathname === '/auth/user/login'

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'all' })

  const login = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${baseURL}login`, data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setAuth(response.data)
      toast.success('Login successful. Redirecting...')
      setTimeout(() => {
        if (response.data?.user?.type === 'Client') {
          const key = `welcomed_${response.data.user._id || response.data.user.id}`
          const hasBeenWelcomed = localStorage.getItem(key)
          navigate(hasBeenWelcomed ? '/user' : '/welcome')
        }
        else navigate('/unauthorized')
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      if (errorMessage.includes('temporarily locked')) {
        setLockUntil(new Date(Date.now() + 2 * 60 * 60 * 1000))
      } else if (errorMessage.includes('Invalid credentials')) {
        setLoginAttempts(prev => prev + 1)
      }
      switch (error.response?.status) {
        case 400:
        case 401: toast.error(errorMessage); break
        case 403: toast.error('Account inactive. Contact support.'); break
        default:  toast.error('Something went wrong, try again later')
      }
    }
  }

  const togglePersist = () => setPersist(prev => !prev)
  useEffect(() => { localStorage.setItem('persist', persist) }, [persist])

  // ── Standalone full page ──────────────────────────────────────────────────
  if (isStandalonePage) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-darkBg">
        <ToastContainer />

        {/* Mini header */}
        <header className="w-full border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 md:px-12 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/semlogo.png" alt="Stock Exchange Mining" className="h-10 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">

            {/* Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="p-8 space-y-6">

                {/* Header */}
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {t('auth.welcomeBack')}
                  </h1>
                  <p className="font-sans text-neutral-500 dark:text-neutral-400">
                    {t('auth.signInAccount')}
                  </p>
                </div>

                <LoginAttempts attempts={loginAttempts} lockUntil={lockUntil} userEmail={null} />

                <form onSubmit={handleSubmit(login)} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('auth.email')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                      })}
                      placeholder={t('auth.enterEmail')}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.email && <p className="mt-1 font-sans text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', { required: 'Password is required' })}
                        placeholder={t('auth.enterPassword')}
                        className="w-full px-4 py-3 pr-11 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 font-sans text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  {/* Remember me + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={togglePersist}
                        checked={persist}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="font-sans text-sm text-neutral-600 dark:text-neutral-400">{t('auth.rememberMe')}</span>
                    </label>
                    <Link to="/forgotpassword" className="font-sans text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isLoading ? (
                      <><CircularProgress size={18} style={{ color: 'white' }} /> Signing In...</>
                    ) : (
                      <><LoginOutlined fontSize="small" /> {t('auth.login')}</>
                    )}
                  </button>
                </form>

                {/* Sign up link */}
                <p className="text-center font-sans text-sm text-neutral-600 dark:text-neutral-400">
                  {t('auth.dontHaveAccount')}{' '}
                  <Link to="/register" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                    {t('auth.signup')}
                  </Link>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ── Modal fallback (used from header Client Portal button) ────────────────
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <ToastContainer />
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-700 w-full max-w-md overflow-hidden">
        <div className="p-8 space-y-6 relative">

          {/* Close */}
          <button
            type="button"
            onClick={() => handleCloseLogin({ type: 'openLogin' })}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="text-center">
            <img src="/semlogo.png" alt="Stock Exchange Mining" className="h-10 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-1">{t('auth.welcomeBack')}</h1>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">{t('auth.signInAccount')}</p>
          </div>

          <LoginAttempts attempts={loginAttempts} lockUntil={lockUntil} userEmail={null} />

          <form onSubmit={handleSubmit(login)} className="space-y-5">
            <div>
              <label className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('auth.email')}</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder={t('auth.enterEmail')}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
              {errors.email && <p className="mt-1 font-sans text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  placeholder={t('auth.enterPassword')}
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 font-sans text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" onChange={togglePersist} checked={persist} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className="font-sans text-sm text-neutral-600 dark:text-neutral-400">{t('auth.rememberMe')}</span>
              </label>
              <Link to="/forgotpassword" onClick={() => handleCloseLogin({ type: 'openLogin' })} className="font-sans text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
              {isLoading ? <><CircularProgress size={18} style={{ color: 'white' }} /> Signing In...</> : <><LoginOutlined fontSize="small" /> {t('auth.login')}</>}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-neutral-600 dark:text-neutral-400">
            {t('auth.dontHaveAccount')}{' '}
            <button
              onClick={() => { handleCloseLogin({ type: 'openLogin' }); handleCloseLogin({ type: 'register' }) }}
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              {t('auth.signup')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
