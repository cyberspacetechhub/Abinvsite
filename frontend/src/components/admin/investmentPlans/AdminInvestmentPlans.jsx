import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from 'react-query'
import baseURL from '../../../shared/baseURL'
import CreateInvestmentPlan from './CreateInvestmentPlan'
import UpdateInvestmentPlan from './UpdateInvestmentPlan'
import { TrendingUp, Add, Edit } from '@mui/icons-material'

const AdminInvestmentPlans = () => {
  const fetch = useFetch()
    const auth = useAuth()
    const url = `${baseURL}investmentplan`

    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    
    const [openUpdate, setOpenUpdate] = useState(false)
    const handleOpendUpdate = () => setOpenUpdate(true)
    const handleCloseUpdate = () => setOpenUpdate(false)
    const [plan, setPlan] = useState(null)
    const fetchPlans = async () => {
        const result = await fetch(url, auth.accessToken);
        // console.log(result)
        return result.data;
      };
    
      const { data, isError, isLoading, isSuccess } = useQuery(
        ["investmentPlans"],
         fetchPlans,
        { keepPreviousData: true,
            staleTime: 10000,
            refetchOnMount:"always",
            onSuccess: () => {
              setTimeout(() => {
              }, 2000)
            }
        }
      );
  return (
    <div className='w-full'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Plans</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage investment plans for your platform</p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Plans</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage investment opportunities</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn-primary flex items-center gap-2"
        >
          <Add className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-20">
          <CircularProgress />
        </div>
      )}

      {/* Plans Grid */}
      {isSuccess && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.investmentPlans?.length > 0 ? (
            data.investmentPlans.map((plan, index) => {
              const planColors = {
                "Basic Plan": { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
                "Standard Plan": { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
                "Premium Plan": { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
                default: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" }
              };
              const colors = planColors[plan.name] || planColors.default;
              
              return (
                <div key={plan._id} className={`card p-6 ${colors.border} border-l-4 hover:shadow-lg transition-all duration-300`}>
                  <div className={`flex items-center justify-center ${colors.bg} rounded-full w-16 h-16 mx-auto mb-4`}>
                    <TrendingUp className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{plan.interest}%</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {plan.noOfTimes} Trade Daily for {plan.duration} Days
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Min Investment:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {plan.minAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Max Investment:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {plan.maxAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Earnings:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Mon - Sun</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {handleOpendUpdate(); setPlan(plan)}} 
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Plan
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Investment Plans</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first investment plan to get started</p>
              <button onClick={handleOpenModal} className="btn-primary">
                Create Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateInvestmentPlan
        open={openModal}
        handleClose={handleCloseModal}
      />
      <UpdateInvestmentPlan 
        open={openUpdate} 
        handleClose={handleCloseUpdate} 
        plan={plan} 
      />
    </div>
  )
}

export default AdminInvestmentPlans
