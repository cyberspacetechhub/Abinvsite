import { ExpandLessOutlined, ExpandMoreOutlined, Star, SearchOutlined, ChevronRightOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Deposit = () => {
    const [subMenu, setSubMenu] = useState()
    const [menu, setMenu] = useState()
    const [isCurr, setIsCurr] = useState()
    const toggleDiv = () => {
        setSubMenu(!subMenu)
    }
    const toggleMenu = () => {
        setMenu(!menu)
    }
    const changeCurr = () => {
        setIsCurr(!isCurr)
    }
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  
    const handleCurrencyChange = (event) => {
      setSelectedCurrency(event.target.value);
      setShowPaymentMethods(true);
    };
  
  
  return (
    <div className=' pt-24 bg-inherit relative w-full h-auto max-sm:h-screen'>
      <div className=' sticky '>
        <div className=' mx-4'>
            <h1 className=' font-bold text-2xl text-gray-700 dark:text-gray-300'>To</h1>
        </div>
        <div className=' max-lg:w-full px-4 grid grid-cols-1 relative my-2'>
            <div className='box-container max-lg:w-full pb-6'>
                <div className='search sticky z-20 border border-gray-800 hover:border-cyan-500 rounded-md dark:bg-gray-800 flex justify-between items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                <div className=' w-full'>
                    <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 py-2 px-4'>
                        <div className=' flex flex-row items-center gap-2'>
                            <div className=' w-12 h-12 border rounded-full'>
                                <img src="" alt="image" className=' w-full h-full rounded-full' />
                            </div>
                            <div className=' flex flex-col'>
                                <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                <div className=''>
                                    <span className=' text-cyan-500'><Star fontSize='' /></span>
                                </div>
                                </span>
                                <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                            </div>
                        </div>
                        <div className=' flex flex-col'>
                            <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                        </div>
                        
                    </Link>
                </div>
                    <div>
                       {
                        !subMenu ?
                        <Link onClick={toggleDiv} className=' text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-3'>
                        <ExpandMoreOutlined fontSize='large' />
                    </Link>:
                    <Link onClick={toggleDiv} className=' text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-3'>
                        {subMenu}
                        <ExpandLessOutlined fontSize='large' />
                    </Link>
                       }
                    </div>
                </div>
               {
                subMenu && (
                    <div className='deposit-content max-lg:w-full leading-10 absolute max-lg:right-0 max-lg:px-4 z-40 -mt-1 shadow-2xl '>
                        <div className=' bg-gray-100 dark:bg-gray-800 relative'>
                            <div className='search w-full mt-3 bg-gray-800 z-40'>
                                <div className=' w-full relative'>
                                    <input type="text" className=' w-full focus:outline-none border-2 border-cyan-500' 
                                    />
                                    <div className=' absolute top-0 right-0'>
                                        <SearchOutlined />
                                    </div>
                                </div>
                                
                                <div className='bg-gray-200 dark:bg-gray-900'>
                                    <div className=' flex flex-row gap-8 justify-start items-center py-2 px-4'>
                                        <div className=''>
                                            <Link className=' bg-cyan-500 rounded-full py-1 px-4 text-gray-700 dark:text-cyan-50'>All</Link>
                                        </div>
                                        <div>
                                            <Link className=' rounded-full border border-gray-300 dark:border-gray-700 py-1 px-4 text-gray-700 dark:text-gray-400'>Favorite</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='scroll-container overflow-y-auto h-56'>
                            <div className=' w-full dark:bg-gray-800 pt-4 '>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>    
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                    
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                    
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>                      
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                            <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                <div className=' flex flex-row items-center gap-2'>
                                    <div className=' w-12 h-12 border rounded-full'>
                                        <img src="" alt="image" className=' w-full h-full rounded-full' />
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                        <div className=''>
                                            <span className=' text-cyan-500'><Star fontSize='' /></span>
                                        </div>
                                        </span>
                                        <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                    </div>
                                </div>
                                <div className=' flex flex-col'>
                                    <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                </div>
                                
                            </Link>
                            </div>
                            </div>
                        </div>
                    </div>
                )
               }
            </div>
        </div>

      </div>
        <div className=' px-4'>
            <div className=''>
                <h1 className=' font-bold text-xl text-gray-700 dark:text-gray-300'>Using</h1>
            </div>
            <div className='deposit-container max-lg:w-full mx- grid grid-cols-1 relativ my-2'>
                {
                    menu && (
                        <div className='deposit-content max-lg:w-full max-lg:right-0 max-lg:px-4 leading-10 absolute top-10 z-40 -mt-1 shadow-2xl overflow-y-auto'>
                            <div className='bg-gray-100 dark:bg-gray-800 relative'>
                            <div className='search absolute w-full z-40'>
                                <div className=' w-full relative'>
                                    <input type="text" className=' w-full focus:outline-none border-2 border-cyan-500' 
                                    />
                                    <div className=' absolute top-0 right-0'>
                                        <SearchOutlined />
                                    </div>
                                </div>
                            </div>
                            <div className='scroll-container overflow-y-auto h-72'>
                            <div className=' w-full pt-10 dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>    
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                    
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                    
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>                      
                                </Link>
                            </div>
                            <div className=' w-full dark:bg-gray-800'>
                                <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 p-4'>
                                    <div className=' flex flex-row items-center gap-2'>
                                        <div className=' w-12 h-12 border rounded-full'>
                                            <img src="" alt="image" className=' w-full h-full rounded-full' />
                                        </div>
                                        <div className=' flex flex-col'>
                                            <span className=' flex flex-row items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300'>USDT
                                            <div className=''>
                                                <span className=' text-cyan-500'><Star fontSize='' /></span>
                                            </div>
                                            </span>
                                            <span className=' text-sm font-semibold text-gray-600 dark:text-gray-300'>Id:</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm font-normal font-mono text-gray-600 dark:text-gray-400'>0</span>
                                    </div>
                                </Link>
                            </div>
                            </div>
                            </div>
                        </div>

                    )
                }
            </div>
            <div className=' flex gap-8 items-center flex-wrap w-full'>
                <div className='box-container max-lg:w-full'>
                    <h1 className=' pb-4 text-gray-400 font-light'>Currency</h1>
                    <div onClick={toggleMenu} className=' max-lg:w-full border border-gray-800 hover:border-cyan-500 rounded-md dark:bg-gray-800 flex justify-between items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                        <div className=' w-full py-4 cursor-pointer'>
                            <Link>                     
                                <span className=' px-4 text-gray-700 dark:text-gray-400 font-light'>Select Currency</span>
                            </Link>
                        </div>
                        <div>
                            {
                                !menu ?
                                <Link onClick={toggleMenu} className=' text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-3'>
                                <ExpandMoreOutlined fontSize='large' />
                            </Link>:
                            <Link onClick={toggleMenu} className=' text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-3'>
                                {menu}
                                <ExpandLessOutlined fontSize='large' />
                            </Link>
                            }
                        </div>
                    </div>
                </div>
                <div className='box-container max-lg:w-full'>
                    <h1 className=' pb-4 text-gray-400 font-light'>Payment method</h1>
                    <div className=' max-lg:w-full border border-gray-800 hover:border-cyan-500 rounded-md dark:bg-gray-800 flex justify-between items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                        <div className=' w-full py-4 cursor-pointer'>
                            {/* <Link className='  w-full flex flex-row justify-between items-center gap-8 relative z-0 py-4 px-4'>
                            <span></span>
                            </Link> */}
                        {
                            !isCurr && (
                                <Link>                     
                                    <span className=' px-4 text-gray-700 dark:text-gray-400 font-light'>Select payment method</span>
                                </Link>
                            )
                        }
                        </div>
                        <div>
                            <Link className=' text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-3'>
                                <ExpandMoreOutlined fontSize='large' />
                            </Link>
                            <Link className=' hidden text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-3'>
                                <ExpandLessOutlined fontSize='large' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className=' mx-4 pt-12 pb-8'>
            <div className=' flex justify-between pb-4'>
                <div className=''>
                    <h3 className=' text-gray-700 dark:text-gray-300 font-semibold text-xl'>Deposit</h3>
                </div>
                <button>
                    <Link className=' text-cyan-400 hover:text-cyan-500'>
                        See more<span><ChevronRightOutlined /></span>
                    </Link>
                </button>
            </div>
            <div className=' border border-gray-300 dark:border-gray-800 py-6 text-center'>
                <span className=' text-gray-700 dark:text-gray-300'>No Transactions</span>
            </div>
        </div>
        <div className='w-full'>
      <select className='box-container p-4 leading-10' value={selectedCurrency} onChange={handleCurrencyChange}>
        <option className='' value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>

      {showPaymentMethods && (
        <div>
          <h2>Select Payment Method</h2>
          <select>
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bankTransfer">Bank Transfer</option>
          </select>
        </div>
      )}
    </div>

    </div>
  )
}

export default Deposit
