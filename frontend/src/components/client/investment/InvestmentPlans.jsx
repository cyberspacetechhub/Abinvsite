import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CircularProgress } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import { TrendingUp, CheckCircle, ArrowBack, StarRounded, ArrowForward } from '@mui/icons-material'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import baseURL from '../../../shared/baseURL'

const ACCENTS = [
  { bar: 'from-primary-500 to-primary-700',   ring: 'border-primary-500 dark:border-primary-400',   badge: 'bg-primary-600'   },
  { bar: 'from-emerald-500 to-teal-600',       ring: 'border-emerald-500 dark:border-emerald-400',   badge: 'bg-emerald-600'   },
  { bar: 'from-violet-500 to-purple-700',      ring: 'border-violet-500 dark:border-violet-400',     badge: 'bg-violet-600'    },
  { bar: 'from-amber-500 to-orange-600',       ring: 'border-amber-500 dark:border-amber-400',       badge: 'bg-amber-600'     },
]

const InvestmentPlans = () => {
  const { auth } = useContext(AuthContext)
  const fetch = useFetch()
  const post = usePost()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const _id = auth?.user?._id

  const { data: plansData, isLoading, isError, isSuccess } = useQuery(
    ['investmentPlans'],
    async () => {
      const res = await fetch(`${baseURL}investmentplan`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const { data: clientData } = useQuery(
    ['client-plans', _id],
    async () => {
      const res = await fetch(`${baseURL}client/${_id}`, auth.accessToken)
      return res.data
    },
    { staleTime: 10000, refetchOnMount: 'always' }
  )

  const currentPlan = clientData?.plan

  const { mutate: doUpgrade, isLoading: upgrading, variables: upgradingId } = useMutation(
    async (planId) => {
      const res = await post(`${baseURL}investment/upgrade`, { userId: _id, newPlanId: planId }, auth.accessToken)
      return res.data
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message || 'Upgrade request submitted successfully')
        queryClient.invalidateQueries(['client-plans', _id])
      },
      onError: (err) => toast.error(err?.response?.data?.error || 'Failed to submit upgrade request')
    }
  )

  const plans = plansData?.investmentPlans || []

  return (
    <div className="min-h-screen pt-16 bg-neutral-50 dark:bg-darkBg">
      <ToastContainer />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 font-sans text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <ArrowBack fontSize="small" /> Back
          </button>
          <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Investment Plans</h1>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Choose a plan that matches your financial goals and start earning daily returns.
          </p>
        </div>

        {/* Current plan banner */}
        {currentPlan && (
          <div className="flex items-center gap-3 px-4 py-3 mb-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <CheckCircle className="text-primary-600 dark:text-primary-400 flex-shrink-0" fontSize="small" />
            <div className="flex-1">
              <p className="font-sans text-xs text-primary-500 dark:text-primary-400">Active Plan</p>
              <p className="font-display font-bold text-sm text-primary-700 dark:text-primary-300">{currentPlan.name}</p>
            </div>
            <Link to="/user/investments" className="font-display text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View <ArrowForward style={{ fontSize: 14 }} />
            </Link>
          </div>
        )}

        {isLoading && <div className="flex justify-center py-20"><CircularProgress size={28} /></div>}
        {isError && <p className="text-center font-sans text-sm text-red-500 py-12">Failed to load plans.</p>}

        {isSuccess && (
          <div className="space-y-4">
            {plans.length > 0 ? plans.map((plan, i) => {
              const accent = ACCENTS[i % ACCENTS.length]
              const isCurrent = currentPlan?._id === plan._id

              return (
                <div
                  key={plan._id}
                  className={`relative bg-white dark:bg-neutral-800 rounded-2xl border overflow-hidden shadow-soft transition-all duration-200 hover:shadow-medium ${
                    isCurrent ? accent.ring + ' border-2' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {/* Top accent bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${accent.bar}`} />

                  {isCurrent && (
                    <div className={`absolute top-4 right-4 flex items-center gap-1 ${accent.badge} text-white font-display text-xs font-bold px-2.5 py-1 rounded-full`}>
                      <StarRounded style={{ fontSize: 12 }} /> Current Plan
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">{plan.name}</h3>
                        <p className="font-sans text-xs text-neutral-400 mt-0.5">{plan.noOfTimes} trade{plan.noOfTimes > 1 ? 's' : ''} daily · {plan.duration} days</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white">{plan.interest}%</p>
                        <p className="font-sans text-xs text-neutral-400">daily return</p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {[
                        { label: 'Min Deposit', value: `$${plan.minAmount?.toLocaleString()}` },
                        { label: 'Max Deposit', value: `$${plan.maxAmount?.toLocaleString()}` },
                        { label: 'Earnings',    value: 'Daily' },
                      ].map((s, j) => (
                        <div key={j} className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 text-center">
                          <p className="font-sans text-xs text-neutral-400 mb-0.5">{s.label}</p>
                          <p className="font-display font-bold text-xs text-neutral-900 dark:text-white">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {isCurrent ? (
                      <button
                        disabled
                        className="font-display w-full inline-flex items-center justify-center gap-2 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 font-semibold text-sm py-3 rounded-lg cursor-not-allowed bg-neutral-50 dark:bg-neutral-700/30"
                      >
                        <CheckCircle fontSize="small" /> Already on this Plan
                      </button>
                    ) : currentPlan ? (
                      <button
                        onClick={() => doUpgrade(plan._id)}
                        disabled={upgrading && upgradingId === plan._id}
                        className="font-display w-full inline-flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-sm py-3 rounded-lg hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 disabled:opacity-50"
                      >
                        {upgrading && upgradingId === plan._id
                          ? <><CircularProgress size={14} /> Requesting...</>
                          : 'Request Upgrade'
                        }
                      </button>
                    ) : (
                      <Link
                        to={`/user/investmentplan/${plan._id}`}
                        className="font-display w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors duration-200"
                      >
                        <TrendingUp fontSize="small" /> Get Started
                      </Link>
                    )}
                  </div>
                </div>
              )
            }) : (
              <div className="text-center py-16">
                <p className="font-display font-semibold text-neutral-500 dark:text-neutral-400">No investment plans available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestmentPlans
