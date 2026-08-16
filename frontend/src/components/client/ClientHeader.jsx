import { DarkModeOutlined, LightModeOutlined, Notifications, MenuOutlined, HourglassEmpty } from '@mui/icons-material'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../../context/AuthProvider'
import { useTheme } from '../../context/ThemeContext'
import { useLocation } from 'react-router-dom'
import baseURL from '../../shared/baseURL'
import { useQuery } from 'react-query'
import useFetch from '../../hooks/useFetch'
import LanguageSwitcher from '../common/LanguageSwitcher'

const ClientHeader = ({aside, setAside }) => {
  const {auth} = useContext(AuthContext)
  const {isDarkMode, toggleDarkMode} = useTheme()
  const location = useLocation()
  const url = `${baseURL}inappmessage/receiver`;
  const id = auth?.user?._id;
  const fetch = useFetch();

  const getMessages = useCallback(async () => {
    try {
      const result = await fetch(`${url}/${id}`, auth.accessToken);
      return result.data;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return { result: [] };
    }
  }, [url, id, auth.accessToken, fetch]);
  
  const { data } = useQuery(
    ["inappmessages", id],
    getMessages,
    {
      enabled: !!id,
      keepPreviousData: true,
      staleTime: 10000,
      refetchOnMount: "always",
    }
  );
  
  const unReadNotifications = data?.result?.filter((message) => !message.read).length || 0;

  // Fetch pending transactions for badge
  const { data: txData } = useQuery(
    ['pending-tx-badge', id],
    async () => {
      const result = await fetch(`${baseURL}transaction/user/${id}?page=1&limit=50`, auth.accessToken)
      return result.data
    },
    { enabled: !!id, staleTime: 15000, refetchOnMount: 'always' }
  )
  const pendingTxCount = (txData?.transactions || []).filter(
    tx => tx.status === 'Pending' && (tx.type === 'Deposit' || tx.type === 'Withdrawal')
  ).length
  
  const handleToggleAside = useCallback(() => {
    setAside((prev) => !prev);
  }, [setAside]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur-md border-gray-200/50 shadow-soft dark:bg-gray-900/95 dark:border-gray-700/50">
      <div className="px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              to="/user" 
              title="Dashboard" 
              className="flex items-center space-x-3 transition-all duration-300 group hover:scale-105"
            >
              <img 
                src="/semlogo.png" 
                alt="Stock Exchange Mining" 
                className="h-10 transition-transform duration-300 md:h-12 group-hover:rotate-3" 
              />
              {/* <span className="hidden text-xl font-bold sm:block font-display text-gradient">
                Stock Exchange Mining
              </span> */}
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle - Desktop only */}
            <button 
              onClick={toggleDarkMode}
              className="hidden md:block p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500/20"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <LightModeOutlined className="w-5 h-5" /> : <DarkModeOutlined className="w-5 h-5" />}
            </button>

            {/* Pending transactions badge */}
            {pendingTxCount > 0 && (
              <Link
                to="/user/transactions"
                title={`${pendingTxCount} pending transaction${pendingTxCount > 1 ? 's' : ''}`}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-display text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors duration-200"
              >
                <HourglassEmpty style={{ fontSize: 14 }} />
                {pendingTxCount} Pending
              </Link>
            )}

            {/* Notifications */}
            <Link 
              to='/user/notifications'
              title={`You have ${unReadNotifications} unread messages`}
              className={`relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500/20 ${
                location.pathname === "/user/notifications" 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Notifications className="w-5 h-5" />
              {unReadNotifications > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1 ring-2 ring-white dark:ring-gray-900 animate-pulse">
                  {unReadNotifications > 9 ? '9+' : unReadNotifications}
                </span>
              )}
            </Link>

            {/* Profile Section - Desktop */}
            <div className="items-center hidden gap-3 md:flex">
              <Link 
                to={`/user/profile/${auth?.user?._id}`} 
                className="relative group"
              >
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white transition-all duration-300 shadow-md rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg group-hover:scale-105">
                  {auth?.user?.profile ? (
                    <img
                      src={auth?.user?.profile}
                      alt="Profile"
                      className="object-cover w-full h-full rounded-xl"
                    />
                  ) : (
                    <span className="text-sm font-bold">
                      {auth?.user?.firstname?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                  auth?.user?.isActive ? 'bg-emerald-500' : 'bg-red-500'
                }`}></span>
              </Link>
              
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 truncate dark:text-white max-w-32">
                  {auth?.user?.firstname} {auth?.user?.lastname}
                </span>
                <span className="text-xs text-gray-500 truncate dark:text-gray-400 max-w-32">
                  {auth?.user?.email}
                </span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={handleToggleAside}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500/20"
              aria-label="Toggle menu"
            >
              <MenuOutlined className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default ClientHeader

