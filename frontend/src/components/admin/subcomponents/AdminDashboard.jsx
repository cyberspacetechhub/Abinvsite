import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminAside from "./AdminAside";

const AdminDashboard = () => {
  const [aside, setAside] = useState(false);

  return (
    <>
      <div className="relative min-h-screen antialiased transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
       
        <AdminHeader setAside={setAside} />

        {/* Sidebar */}
        <AdminAside aside={aside} setAside={setAside} />

        {/* Main Content */}
        <main className="flex-1 max-w-full px-6 pt-20 pb-10 ml-0 overflow-hidden md:ml-72">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 mt-8 bg-white border-t border-gray-200 md:ml-64 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              {new Date().getFullYear()} © Stock Exchange Mining Admin Panel. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AdminDashboard;