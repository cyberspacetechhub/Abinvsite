import { useState } from "react";
import { Link } from "react-router-dom";
import { ClickAwayListener } from "@mui/material";
import AuthContext from "../../../context/AuthProvider";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const AdminHeader = ({ setAside }) => {
  const {auth} = useContext(AuthContext)
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <ToastContainer />
      <div className="flex flex-wrap items-center justify-between">
        <nav className="flex items-center justify-start">
          <ClickAwayListener
            onClickAway={() => {
              setAside(false);
            }}
          >
            <button
              data-drawer-target="drawer-navigation"
              data-drawer-toggle="drawer-navigation"
              aria-controls="drawer-navigation"
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer dark:text-gray-300 md:hidden hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-600"
              onClick={() => setAside((aside) => !aside)}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>
          </ClickAwayListener>
          <Link to='/admin' className="flex items-center">
            <img src='/semlogo.png' alt="Stock Exchange Mining" className="h-10 md:h-12" />
            {/* <span className="ml-3 text-2xl font-bold font-display text-gradient">Admin</span> */}
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 transition-all duration-300 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <Link to={`/admin/profile/${auth?.user?._id}`} className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-blue-600 border-2 border-blue-200 rounded-full hover:bg-blue-700 dark:border-blue-400">
              {
                !auth?.user?.profile ? (
                  <h1 className="text-xl font-bold text-white">{auth?.user?.firstname.slice(0,1)}</h1>
                ) : (
                  <img
                    src={auth?.user?.profile}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                )
              }
            </Link>
            <div className="hidden md:block">
              <div className="flex flex-col items-start justify-start">
                <span className="font-semibold text-gray-900 dark:text-white">{`${auth?.user?.firstname} ${auth?.user?.lastname}`}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{auth?.user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;