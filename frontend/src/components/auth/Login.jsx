
import React, {useEffect, useState} from 'react'
import baseURL from '../../shared/baseURL'
import AuthContext from '../../context/AuthProvider'
import axios from 'axios'
import { set, useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CircularProgress } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../common/LanguageSwitcher'

const Login = () => {
  const { t } = useTranslation();
  const {auth, setAuth, persist, setPersist,} = useContext(AuthContext)
  const url = `${baseURL}login`
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });

  const login = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      if (response.status !== 200) {
        setIsLoading(false)
        throw new Error('Network response was not ok')
      }
     
      setTimeout(() => {
        if(response.data?.user?.type === 'Admin') {
          navigate('/admin')
          setAuth(response.data)
         // console.log(response.data)
          toast.success('Login successful. Redirecting...')
    
        } else if(response.data?.user?.type === 'Agent'){
          navigate('/unauthorized')
        } else if(response.data?.user?.type === 'Owner'){
          navigate('/unauthorized')
        }else{
          navigate('/unauthorized')
        }
        setIsLoading(false)
      }, 2000);
    } catch (error) {
      setIsLoading(false)
      switch (error.response.status) {
        case 400:
          toast.error('Invalid email or password')
          break;
        case 401:
          toast.error('Invalid credentials')
          break;
        default:
          toast.error('Something went wrong, try again later')
          break;
      }
      // console.log(error)
    }
  };
  const togglePersist = () => {
    setPersist((prev) => !prev)
  }
  useEffect(() => {
  localStorage.setItem('persist', persist)
  }, [persist])
  //console.log(auth)

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <img src="/semlogo.png" alt="Stock Exchange Mining" className="h-12 md:h-16" />
          <LanguageSwitcher />
        </div>
      </div>
      <ToastContainer />
      <div className="container mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t('auth.welcomeBack')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{t('auth.signInAccount')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
              <form
                onSubmit={handleSubmit(login)}
                className=""
              >
                <div className=" space-y-6">
                  <div>
                    <label
                      className=" block text-base font-medium text-gray-700 dark:text-gray-300"
                      htmlFor="user_email"
                    >
                      {t('auth.email')}
                    </label>
                    <div className="input mt-2 relative rounded-md shadow-sm">
                      <input
                        placeholder={t('auth.enterEmail')}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required="required"
                        type="email"
                        {...register("email", 
                          {required : true},
                          {pattern: /^\S+@\S+$/i} 
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {t('errors.required')}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label
                      className=" block text-base font-medium text-gray-700 dark:text-gray-300"
                      htmlFor="password"
                    >
                      {t('auth.password')}
                    </label>
                    <div className="input mt-2 relative rounded-md shadow-sm">
                      <input
                        placeholder={t('auth.enterPassword')}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3 px-4 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required="required"
                        type={showPassword ? "text" : "password"}
                        {...register("password",{required : true },
                          {minLength: 8}, 
                          {maxLength: 32}, 
                          
                        )}
                      />
                      <button onClick={togglePasswordVisibility} type="button" className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                        {
                          showPassword ? 
                          <Visibility className="w-5 h-5" /> :
                          <VisibilityOff className="w-5 h-5" />
                        }
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {t('errors.required')}
                      </p>
                    )}
                  </div>

                  <div className=" flex items-center justify-between">
                    <div className=" flex items-center">
                      
                      <input
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        type="checkbox"
                        name=""
                        id="remember me"
                        onChange={togglePersist}
                        checked={persist}
                      />
                      <label
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        htmlFor="remember-me"
                      >
                        {t('auth.rememberMe')}
                      </label>
                    </div>

                    <div className=" text-base">
                      <Link to='/forgotpassword' className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                        {t('auth.forgotPassword')}
                      </Link>
                    </div>
                  </div>

                  <div className="">
                    <button
                      type='submit'
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={20} style={{color: 'white'}} /> : t('auth.login')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Login
