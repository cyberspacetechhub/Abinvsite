import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import EarningsNotification from '../utils/EarningsNotification'
import SmartsuppChat from '../utils/SmartsuppChat'
import useInactivityPrompt from '../../hooks/useInactivityPrompt'

const Home = () => {
  const { showPrompt, dismissPrompt } = useInactivityPrompt(120000); // 2 minutes
  
  return (
    <>
     <div className='bg-white dark:bg-darkBg m-0 font-sans w-full min-h-screen overflow-x-hidden'>
      <EarningsNotification />
      <Header />
      <Outlet />
      <Footer />
      <SmartsuppChat />
      {/* <WhatsappButton /> */}
     </div>
    </>
  )
}

export default Home
