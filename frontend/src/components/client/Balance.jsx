import { AddCircleOutline, AttachMoney, DeleteOutline, Done, EditOutlined, FavoriteOutlined, GridViewOutlined, MenuOutlined, MonetizationOn, MonetizationOnOutlined, Money, MoneyOff, Redeem, RemoveCircleOutline, Star, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../../context/AuthProvider'
import useFetch from '../../hooks/useFetch'
import baseURL from '../../shared/baseURL'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

const Balance = () => {
    const [showBal, setShowBal] = useState()
    const [hideBal, setHideBal] = useState(false)
        const toggleBal =() => {
            setHideBal(!hideBal)
        }
    const handleBal = () => {
        setShowBal(!showBal)
    }

    const {auth} = useContext(AuthContext)
        const fetch = useFetch()
        const url = `${baseURL}transaction/user`
        const navigate = useNavigate()
    
        const [page, setPage] = useState(1);
      const handleChange = (event, value) => {
        setPage(value);
      };
        const fetchTransactions = async () => {
          const result = await fetch(`${url}/${_id}?page=${page}&limit=10`, auth.accessToken);
          // console.log(result)
          return result.data;
        };
      
        const { data, isError, isLoading, isSuccess } = useQuery(
          ["transactions"],
           fetchTransactions,
          { keepPreviousData: true,
              staleTime: 10000,
              refetchOnMount:"always",
              onSuccess: () => {
                setTimeout(() => {
                }, 2000)
              }
          }
        );
        const _id = auth?.user?._id
        const fetchTrades = async () => {
          const result = await fetch(`${baseURL}trade/user/${_id}`, auth.accessToken);
          // console.log(result)
          return result.data;
        };
      
        const { data:tradeData, isError:tradeError, isLoading:tradeLoading, isSuccess:tradeSuccess } = useQuery(
          ["trades"],
           fetchTrades,
          { keepPreviousData: true,
              staleTime: 10000,
              refetchOnMount:"always",
              onSuccess: () => {
                setTimeout(() => {
                }, 2000)
              }
          }
        );
    
        const calculateTotals = (transactions) => {
          if (!transactions) return { totalDeposit: 0, totalWithdrawal: 0, totalInvestment: 0, totalAll: 0 };
        
          return transactions.reduce(
            (totals, transaction) => {
              const amount = Number(transaction.amount) || 0;
              totals.totalAll += amount;
              switch (transaction.type) {
                case "Deposit":
                  totals.totalDeposit += transaction.amount || 0;
                  break;
                case "Withdrawal":
                  totals.totalWithdrawal += transaction.amount || 0;
                  break;
                case "Investment":
                  totals.totalInvestment += transaction.amount || 0;
                  break;
                default:
                  break;
              }
              return totals;
            },
            { totalDeposit: 0, totalWithdrawal: 0, totalInvestment: 0 }
          );
        };
        const totals = calculateTotals(data?.transactions);

        const totalProfit = tradeData?.length > 0 
          ? tradeData.reduce((acc, trade) => acc + trade.amount, 0) // Sum up the trade amounts
          : 0; // If no data, return 0
        // console.log(auth)

        const balance = auth?.user?.balance || 0
  return (
    <div className='min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 md:ml-8'>
      <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Account Balance</h1>
              <p className='mt-1 text-gray-600 dark:text-gray-400'>Manage your funds and view balance details</p>
            </div>
            <button
              onClick={toggleBal}
              className='p-3 transition-all duration-300 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-md dark:border-gray-700 hover:scale-105'
              title={hideBal ? 'Hide balance' : 'Show balance'}
            >
              {!hideBal ? (
                <VisibilityOutlined className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              ) : (
                <VisibilityOffOutlined className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              )}
            </button>
          </div>
          
          {/* Main Balance Display */}
          <div className='p-8 text-center card-elevated'>
            <div className='mb-4'>
              <p className='mb-2 text-lg font-medium text-gray-600 dark:text-gray-400'>Total Balance</p>
              <div className='flex items-center justify-center gap-3'>
                {!hideBal ? (
                  <h2 className='text-6xl font-bold text-gray-400 dark:text-gray-500'>••••••</h2>
                ) : (
                  <>
                    <h2 className='text-6xl font-bold text-gray-900 dark:text-white'>
                      ${balance ? balance.toFixed(2) : '0.00'}
                    </h2>
                    <span className='text-2xl font-medium text-gray-500 dark:text-gray-400'>USD</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2'>
          <Link 
            to='/user/depositmethod' 
            className='flex items-center justify-center gap-4 p-6 transition-all duration-300 border-2 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 group hover:scale-105'
          >
            <div className='flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-emerald-500 rounded-xl group-hover:scale-110'>
              <AddCircleOutline className='w-6 h-6 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-emerald-700 dark:text-emerald-400'>Add Funds</h3>
              <p className='text-sm text-emerald-600 dark:text-emerald-500'>Deposit money to your account</p>
            </div>
          </Link>
          
          <Link 
            to='/user/withdrawalmethod' 
            className='flex items-center justify-center gap-4 p-6 transition-all duration-300 border-2 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 group hover:scale-105'
          >
            <div className='flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-amber-500 rounded-xl group-hover:scale-110'>
              <RemoveCircleOutline className='w-6 h-6 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-amber-700 dark:text-amber-400'>Withdraw Funds</h3>
              <p className='text-sm text-amber-600 dark:text-amber-500'>Transfer money from your account</p>
            </div>
          </Link>
        </div>
        {/* Balance Breakdown */}
        <div>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>Balance Breakdown</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {/* Total Deposit */}
            <div className='p-6 border card-elevated bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl'>
                  <AttachMoney className='w-6 h-6 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-emerald-700 dark:text-emerald-400'>Total Deposit</p>
                  <p className='text-2xl font-bold text-emerald-800 dark:text-emerald-300'>
                    {!hideBal ? '••••••' : totals.totalDeposit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Withdrawal */}
            <div className='p-6 border border-red-200 card-elevated bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl'>
                  <MoneyOff className='w-6 h-6 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-red-700 dark:text-red-400'>Total Withdrawal</p>
                  <p className='text-2xl font-bold text-red-800 dark:text-red-300'>
                    {!hideBal ? '••••••' : totals.totalWithdrawal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Investment */}
            <div className='p-6 border border-blue-200 card-elevated bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl'>
                  <MonetizationOnOutlined className='w-6 h-6 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-blue-700 dark:text-blue-400'>Total Investment</p>
                  <p className='text-2xl font-bold text-blue-800 dark:text-blue-300'>
                    {!hideBal ? '••••••' : totals.totalInvestment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Trading Balance */}
            <div className='p-6 border border-purple-200 card-elevated bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl'>
                  <MonetizationOnOutlined className='w-6 h-6 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-purple-700 dark:text-purple-400'>Trading Balance</p>
                  <p className='text-2xl font-bold text-purple-800 dark:text-purple-300'>
                    {!hideBal ? '••••••' : auth?.user?.tradingBalance?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Profits */}
            <div className='p-6 border card-elevated bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border-cyan-200 dark:border-cyan-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-cyan-500 rounded-xl'>
                  <AttachMoney className='w-6 h-6 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-cyan-700 dark:text-cyan-400'>Total Profits</p>
                  <p className='text-2xl font-bold text-cyan-800 dark:text-cyan-300'>
                    {!hideBal ? '••••••' : auth?.user?.profitBalance?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bonus */}
            <div className='p-6 border card-elevated bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-amber-500 rounded-xl'>
                  <Redeem className='w-6 h-6 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-amber-700 dark:text-amber-400'>Bonus</p>
                  <p className='text-2xl font-bold text-amber-800 dark:text-amber-300'>
                    {!hideBal ? '••••••' : auth?.user?.bonus?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
