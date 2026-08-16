import { Link, useLocation} from "react-router-dom";
import { useState } from "react";
import Logout from "../../auth/Logout";
import { BarChart, Mail, Dashboard, AccountBalance, Payment, TrendingUp, People, ExitToApp, Upgrade, VerifiedUser, Security, Memory, BuildCircle, MarkEmailRead } from "@mui/icons-material";

const AdminAside = ({ aside, setAside }) => {
  const location = useLocation();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleOpenLogoutModal = () => setOpenLogoutModal(true);
  const handleCloseLogoutModal = () => setOpenLogoutModal(false);

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        {
          path: '/admin',
          icon: Dashboard,
          label: 'Overview',
          exact: true
        }
      ]
    },
    {
      title: 'Transactions',
      items: [
        {
          path: '/admin/transactions',
          icon: AccountBalance,
          label: 'All Transactions'
        },
        {
          path: '/admin/deposits',
          icon: TrendingUp,
          label: 'Deposits'
        },
        {
          path: '/admin/withdrawals',
          icon: AccountBalance,
          label: 'Withdrawals'
        },
        {
          path: '/admin/investments',
          icon: TrendingUp,
          label: 'Investments'
        }
      ]
    },
    {
      title: 'Trading',
      items: [
        {
          path: '/admin/trades',
          icon: BarChart,
          label: 'Trade Log'
        }
      ]
    },
    {
      title: 'Plans & Upgrades',
      items: [
        {
          path: '/admin/investmentplans',
          icon: TrendingUp,
          label: 'Investment Plans'
        },
        {
          path: '/admin/plan-upgrades',
          icon: Upgrade,
          label: 'Plan Upgrades'
        }
      ]
    },
    {
      title: 'Configuration',
      items: [
        {
          path: '/admin/depositmethods',
          icon: Payment,
          label: 'Deposit Methods'
        },
        {
          path: '/admin/mining-machines',
          icon: Memory,
          label: 'Mining Machines'
        },
        {
          path: '/admin/service-requests',
          icon: BuildCircle,
          label: 'Service Requests'
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          path: '/admin/clients',
          icon: People,
          label: 'Clients'
        },
        {
          path: '/admin/kyc/review',
          icon: VerifiedUser,
          label: 'KYC Review'
        },
        {
          path: '/admin/kyc/all',
          icon: VerifiedUser,
          label: 'All KYC'
        },
        {
          path: '/admin/unlock-requests',
          icon: Security,
          label: 'Unlock Requests'
        },
        {
          path: '/admin/message-requests',
          icon: Mail,
          label: 'Messages'
        },
        {
          path: '/admin/email-center',
          icon: MarkEmailRead,
          label: 'Email Center'
        }
      ]
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname === item.path;
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pb-3 pt-20 transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg max-sm:w-80 md:translate-x-0 ${
        aside ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="h-full py-6 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Panel</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your platform</p>
        </div>

        <div className="px-3 space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  
                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <Icon className={`w-5 h-5 transition-colors duration-200 ${
                          active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`} />
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleOpenLogoutModal}
            className="flex items-center w-full p-3 text-base font-medium text-red-600 dark:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group"
          >
            <ExitToApp className="w-6 h-6 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
      <Logout open={openLogoutModal} handleClose={handleCloseLogoutModal} />
    </aside>
  );
};

export default AdminAside;