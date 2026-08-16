import { useContext } from 'react'
import { useQuery } from 'react-query'
import { WarningAmber, ContentCopy } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AuthContext from '../../../context/AuthProvider'
import useFetch from '../../../hooks/useFetch'
import baseURL from '../../../shared/baseURL'

// account: 'trading' | 'mining' | 'general' | null (null = show all)
const useActiveServices = (account = null) => {
    const { auth } = useContext(AuthContext)
    const fetch = useFetch()
    const _id = auth?.user?._id

    const { data } = useQuery(
        ['active-services', _id],
        async () => {
            const res = await fetch(`${baseURL}service-requests/user/${_id}/active`, auth.accessToken)
            return res.data
        },
        { staleTime: 15000, refetchOnMount: 'always', enabled: !!_id }
    )

    const all = data?.services || []
    if (!account) return all
    return all.filter(s => s.account === account || s.account === 'general')
}

// Hook to check if a specific account is blocked
export const useIsBlocked = (account) => {
    const services = useActiveServices(account)
    return services.length > 0
}

// Banner component — renders nothing if no active services for this account
const ServiceBanner = ({ account = null }) => {
    const services = useActiveServices(account)
    if (services.length === 0) return null

    return (
        <div className="space-y-3 mb-4">
            {services.map(s => (
                <div key={s._id} className="rounded-xl border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 p-4">
                    <div className="flex items-start gap-3">
                        <WarningAmber className="text-orange-500 flex-shrink-0 mt-0.5" fontSize="small" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-orange-800 dark:text-orange-300 text-sm">{s.type}</p>
                            {s.message && <p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">{s.message}</p>}
                            {s.requiresPayment && (
                                <div className="mt-2 p-3 rounded-lg bg-white dark:bg-neutral-800 border border-orange-200 dark:border-orange-800">
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Required: <span className="text-orange-600 dark:text-orange-400">${s.amountRequired?.toLocaleString()}</span>
                                    </p>
                                    {s.depositMethod && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Send to <span className="font-semibold text-gray-700 dark:text-gray-300">{s.depositMethod.name}</span>:
                                            </p>
                                            <span className="font-mono text-xs text-gray-800 dark:text-white truncate">{s.depositMethod.value}</span>
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(s.depositMethod.value); toast.success('Address copied!') }}
                                                className="flex-shrink-0 p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                                            >
                                                <ContentCopy style={{ fontSize: 14 }} className="text-orange-500" />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                        ⚠️ Your account activities are paused until this is resolved by admin.
                                    </p>
                                </div>
                            )}
                            {!s.requiresPayment && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                    ⚠️ Your account activities are paused until this is resolved by admin.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { useActiveServices }
export default ServiceBanner
