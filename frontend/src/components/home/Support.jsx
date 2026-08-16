import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import Call from  '/call.png'
import Sms from  '/email.png'
import Address from  '/location.png'
import { motion } from 'framer-motion'
import usePost from '../../hooks/usePost';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import baseURL from '../../shared/baseURL';
import { CircularProgress } from '@mui/material';
import { Phone, Email, LocationOn, Chat, Send } from '@mui/icons-material';

const Support = () => {
    const post = usePost();
  const url = `${baseURL}messagereq`;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {auth} = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({ mode: "all" });
  
    const sendMessage = async (data) => {
      setIsLoading(true)
      const formData = new FormData();
    
    // Append form fields
    for ( const key in data) {
      formData.append(key, data[key]);
    }
  
    // Log the FormData contents
    for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    }
      try{
        const response = await post(url, formData);
        // console.log(response.data);
        toast.success("Message Sent Successfully!");
        setTimeout(() => {
          reset()
        }, 3000);
      } catch (err) {
        setIsLoading(false)
        toast.error(err.response?.data?.error || err.message)
        setError(err.response?.data?.error || err.message)
      }
    //   console.log(formData)
    };
  
    const {mutate} = useMutation(sendMessage, {
      
      onSuccess : ()=>{
        setIsLoading(false)
        queryClient.invalidateQueries('/support')
      }
    })
  
    const handleSendMessage = (data) => {
    mutate(data);  
  };

  return (
    <div className='pt-20 bg-white dark:bg-darkBg'>
      <ToastContainer />
      
      <div className='px-6 pb-10 md:px-12'>
        <nav className='flex items-center space-x-2 text-sm'>
          <Link to='/' className='font-medium text-blue-600 transition-colors duration-300 hover:text-blue-700'>Home</Link>
          <span className='text-gray-400'>/</span>
          <span className='font-medium text-gray-600 dark:text-gray-300'>Support</span>
        </nav>
      </div>

      <div className='px-6 py-20 mx-auto max-w-7xl md:px-12'>
        <div className='grid grid-cols-1 gap-16 lg:grid-cols-2'>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-8'>
            
            <div>
              <h1 className='mb-6 text-4xl font-bold leading-tight text-gray-900 font-display md:text-5xl dark:text-white'>
                Expert <span className='text-gradient'>Support</span> When You Need It
              </h1>
              <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300'>
                Our professional trading support team provides instant assistance for platform navigation, 
                trading strategies, and technical issues. Get expert guidance to maximize your trading success.
              </p>
            </div>

            {/* Contact Cards */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className='p-6 text-center transition-transform duration-300 card hover:scale-105'>
                <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl'>
                  <Chat className='text-white' fontSize='large' />
                </div>
                <h3 className='mb-2 text-xl font-bold text-gray-900 font-display dark:text-white'>Instant Trading Support</h3>
                <p className='font-semibold text-blue-600'>Live chat with trading experts</p>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>Real-time assistance & market insights</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='p-6 text-center transition-transform duration-300 card hover:scale-105'>
                <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl'>
                  <Email className='text-white' fontSize='large' />
                </div>
                <h3 className='mb-2 text-xl font-bold text-gray-900 font-display dark:text-white'>Priority Email Support</h3>
                <p className='text-sm font-semibold text-emerald-600'>support@stockexchangemining.com</p>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>Expert responses within 1 hour</p>
              </motion.div>
            </div>

            {/* Office Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='p-8 card'>
              <div className='flex items-start gap-4'>
                <div className='flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl'>
                  <LocationOn className='text-white' fontSize='large' />
                </div>
                <div>
                  <h3 className='mb-2 text-xl font-bold text-gray-900 font-display dark:text-white'>Trading Operations Center</h3>
                  <p className='mb-2 text-gray-600 dark:text-gray-300'>
                    Financial District<br />
                    Level 15, Tower One<br />
                    Sydney NSW 2000, Australia
                  </p>
                  <p className='font-semibold text-purple-600'>support@stockexchangemining.com</p>
                </div>
              </div>
            </motion.div>

            <div className='p-6 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-xl'>
              <p className='font-semibold text-center text-gray-700 dark:text-gray-300'>
                🚀 Professional trading support across all global markets
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='p-8 card-elevated'>
            
            <div className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900 font-display dark:text-white'>Connect with Trading Experts</h2>
              <p className='text-gray-600 dark:text-gray-300'>
                Share your trading goals or technical questions. Our specialists will provide personalized guidance 
                to enhance your trading performance.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleSendMessage)} className='space-y-6'>
              <div>
                <label className='block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Full Name *
                </label>
                <input 
                  name='name' 
                  {...register('name', {required:'Full name is required'})} 
                  className='w-full px-4 py-3 text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  type="text"
                  placeholder='Enter your full name'
                />
                {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
              </div>

              <div>
                <label className='block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Email Address *
                </label>
                <input 
                  name='email'
                  {...register('email', {required:'Email is required'})}
                  className='w-full px-4 py-3 text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  type="email"
                  placeholder='Enter your email address'
                />
                {errors.email && <p className='mt-1 text-sm text-red-500'>{errors.email.message}</p>}
              </div>

              <div>
                <label className='block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Phone Number *
                </label>
                <input 
                  name='phone'
                  {...register('phone', {required:'Phone number is required'})}
                  className='w-full px-4 py-3 text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  type="tel"
                  placeholder='Enter your phone number'
                />
                {errors.phone && <p className='mt-1 text-sm text-red-500'>{errors.phone.message}</p>}
              </div>

              <div>
                <label className='block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Message *
                </label>
                <textarea 
                  name='message'
                  {...register('message', {required:'Message is required'})}
                  rows={6}
                  className='w-full px-4 py-3 text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  placeholder='Describe your trading question or technical issue...'
                />
                {errors.message && <p className='mt-1 text-sm text-red-500'>{errors.message.message}</p>}
              </div>

              <button 
                type='submit'
                disabled={isLoading}
                className='w-full py-4 text-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <CircularProgress size={20} className='text-white' />
                    Sending Message...
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2'>
                    <Send className='w-5 h-5' />
                    Send Message
                  </div>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Support