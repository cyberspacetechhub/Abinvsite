import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ClientHeader from './ClientHeader';
import ClientAside from './ClientAside';
import SmartsuppChat from '../utils/SmartsuppChat';

const ClientHome = () => {
    const [aside , setAside] = useState(false)
  return (
    <div className=' antialiased'>
        <ClientHeader setAside={setAside} />

        <ClientAside aside={aside} setAside={setAside} />

        <main className="md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Outlet />
        </main>
        <SmartsuppChat />
    </div>
  )
}

export default ClientHome
