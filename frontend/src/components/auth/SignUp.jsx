import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import { useQueryClient, useMutation } from 'react-query'
import { CircularProgress } from '@mui/material'
import { Visibility, VisibilityOff, PersonAddAlt, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material'
import { useTheme } from '../../context/ThemeContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import countries from '../utils/countries'
import { useTranslation } from 'react-i18next'
import usePost from '../../hooks/usePost'
import baseURL from '../../shared/baseURL'

const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200'
const labelClass = 'block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300'
const errorClass = 'mt-1 font-sans text-xs text-red-500'

const SignUp = ({ open, handleClose }) => {
  const { t } = useTranslation()
  const post = usePost()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isStandalonePage = location.pathname === '/register'

  const { register, handleSubmit, formState: { errors } } = useForm()

  const createAccount = async (data) => {
    setIsLoading(true)
    const formData = new FormData()
    for (const key in data) {
      if (data[key]) formData.append(key, data[key])
    }
    await post(`${baseURL}register`, formData)
  }

  const { mutate } = useMutation(createAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('client')
      toast.success('Account created successfully! Redirecting to login...')
      setIsLoading(false)
      setTimeout(() => {
        if (!isStandalonePage) {
          handleClose({ type: 'register' })
          handleClose({ type: 'openLogin' })
        } else {
          navigate('/auth/user/login')
        }
      }, 3000)
    },
    onError: (err) => {
      setIsLoading(false)
      switch (err.response?.status) {
        case 409: toast.error('An account with this email already exists'); break
        default:  toast.error('Something went wrong, try again later')
      }
    },
  })

  const handleCreateAccount = (data) => mutate(data)

  // ── Shared form fields ────────────────────────────────────────────────────
  const formFields = (isModal = false) => (
    <form onSubmit={handleSubmit(handleCreateAccount)} className="space-y-4">

      {/* First + Last name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t('auth.firstName')}</label>
          <input
            type="text"
            {...register('firstname', { required: 'First name is required' })}
            placeholder={t('auth.enterFirstName')}
            className={inputClass}
          />
          {errors.firstname && <p className={errorClass}>{errors.firstname.message}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('auth.lastName')}</label>
          <input
            type="text"
            {...register('lastname', { required: 'Last name is required' })}
            placeholder={t('auth.enterLastName')}
            className={inputClass}
          />
          {errors.lastname && <p className={errorClass}>{errors.lastname.message}</p>}
        </div>
      </div>

      {/* Username */}
      <div>
        <label className={labelClass}>Username</label>
        <input
          type="text"
          {...register('username', { required: 'Username is required' })}
          placeholder="Choose a username"
          className={inputClass}
        />
        {errors.username && <p className={errorClass}>{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>{t('auth.email')}</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
          })}
          placeholder={t('auth.enterEmail')}
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>{t('profile.phone')}</label>
        <input
          type="text"
          {...register('phone', { required: 'Phone number is required' })}
          placeholder="Enter phone number"
          className={inputClass}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      {/* Country */}
      <div>
        <label className={labelClass}>{t('profile.country')}</label>
        <select
          defaultValue="default"
          {...register('country', { required: 'Country is required' })}
          className={inputClass}
        >
          <option value="default" disabled>-- Select Country --</option>
          {countries.map((c, i) => (
            <option key={i} value={c.name}>{c.name}</option>
          ))}
        </select>
        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
      </div>

      {/* Address */}
      <div>
        <label className={labelClass}>{t('profile.address')}</label>
        <input
          type="text"
          {...register('address', { required: 'Address is required' })}
          placeholder="Enter residential address"
          className={inputClass}
        />
        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
      </div>

      {/* Referral code */}
      <div>
        <label className={labelClass}>Referral Code <span className="text-neutral-400 font-normal">(Optional)</span></label>
        <input
          type="text"
          {...register('referralCode')}
          placeholder="Enter referral code"
          maxLength={9}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div>
        <label className={labelClass}>{t('auth.password')}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
            placeholder={t('auth.enterPassword')}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
          </button>
        </div>
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-2"
      >
        {isLoading ? (
          <><CircularProgress size={18} style={{ color: 'white' }} /> Creating Account...</>
        ) : (
          <><PersonAddAlt fontSize="small" /> {t('auth.signup')}</>
        )}
      </button>
    </form>
  )

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
        <div className="flex-1 flex items-start justify-center px-4 py-12">
          <div className="w-full max-w-lg">

            {/* Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="p-8 space-y-6">

                {/* Header */}
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {t('auth.createAccount')}
                  </h1>
                  <p className="font-sans text-neutral-500 dark:text-neutral-400">
                    Join thousands of successful traders worldwide
                  </p>
                </div>

                {formFields()}

                {/* Login link */}
                <p className="text-center font-sans text-sm text-neutral-600 dark:text-neutral-400">
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link to="/auth/user/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                    {t('auth.login')}
                  </Link>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ── Modal fallback ────────────────────────────────────────────────────────
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <ToastContainer />
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-8 space-y-6 relative">

          {/* Close */}
          <button
            type="button"
            onClick={() => handleClose({ type: 'register' })}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="text-center">
            <img src="/semlogo.png" alt="Stock Exchange Mining" className="h-10 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-1">{t('auth.createAccount')}</h1>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">Join thousands of successful traders</p>
          </div>

          {formFields(true)}

          <p className="text-center font-sans text-sm text-neutral-600 dark:text-neutral-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <button
              onClick={() => { handleClose({ type: 'register' }); handleClose({ type: 'openLogin' }) }}
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              {t('auth.login')}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignUp
