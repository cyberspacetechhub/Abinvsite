import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import { ArrowBack, Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material'
import AuthContext from '../../context/AuthProvider'
import useUpdate from '../../hooks/useUpdate'
import baseURL from '../../shared/baseURL'

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)                    score++
  if (/[A-Z]/.test(pwd))                  score++
  if (/[0-9]/.test(pwd))                  score++
  if (/[^A-Za-z0-9]/.test(pwd))           score++
  const map = [
    { label: '',          color: '' },
    { label: 'Weak',      color: 'bg-red-500' },
    { label: 'Fair',      color: 'bg-amber-500' },
    { label: 'Good',      color: 'bg-primary-500' },
    { label: 'Strong',    color: 'bg-emerald-500' },
  ]
  return { score, ...map[score] }
}

const ChangePassword = () => {
  const { auth } = useContext(AuthContext)
  const update = useUpdate()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const newPwd = watch('password', '')
  const strength = getStrength(newPwd)

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    const formData = new FormData()
    formData.append('password', data.password)
    try {
      await update(`${baseURL}user/changepswd/${auth?.user?._id}`, formData, auth?.accessToken)
      setDone(true)
      setTimeout(() => {
        navigate(auth?.user?.type === 'Admin' ? '/auth/admin/login' : '/auth/user/login')
      }, 3000)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg flex flex-col">
      <ToastContainer />
      <div className="max-w-md mx-auto w-full px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowBack fontSize="small" /> Back
        </button>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Change Password</h1>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Choose a strong password to keep your account secure.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft p-6">

          {!done ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* New password */}
              <div>
                <label className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Enter new password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                    })}
                    className="w-full px-4 py-3 pr-11 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showNew ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 font-sans text-xs text-red-500">{errors.password.message}</p>}

                {/* Strength bar */}
                {newPwd && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : 'bg-neutral-200 dark:bg-neutral-600'}`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className={`font-sans text-xs font-medium ${
                        strength.score === 1 ? 'text-red-500' :
                        strength.score === 2 ? 'text-amber-500' :
                        strength.score === 3 ? 'text-primary-500' : 'text-emerald-500'
                      }`}>
                        {strength.label} password
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block mb-1.5 font-sans text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    className="w-full px-4 py-3 pr-11 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showConfirm ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 font-sans text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {/* Requirements */}
              <div className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 space-y-1.5">
                <p className="font-display text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-2">Password requirements</p>
                {[
                  { rule: newPwd.length >= 8,           text: 'At least 8 characters' },
                  { rule: /[A-Z]/.test(newPwd),         text: 'One uppercase letter' },
                  { rule: /[0-9]/.test(newPwd),         text: 'One number' },
                  { rule: /[^A-Za-z0-9]/.test(newPwd),  text: 'One special character' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${r.rule ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-600'}`}>
                      {r.rule && <CheckCircle style={{ fontSize: 12 }} className="text-white" />}
                    </div>
                    <span className={`font-sans text-xs transition-colors duration-200 ${r.rule ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`}>
                      {r.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                {isSubmitting
                  ? <><CircularProgress size={16} style={{ color: 'white' }} /> Updating...</>
                  : <><Lock fontSize="small" /> Update Password</>
                }
              </button>
            </form>
          ) : (
            /* Success state */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" fontSize="large" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-white mb-2">Password Updated</h3>
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  Your password has been changed successfully. You will be redirected to the login page shortly.
                </p>
              </div>
              <div className="flex justify-center">
                <CircularProgress size={20} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ChangePassword
