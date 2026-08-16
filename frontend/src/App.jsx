import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css'
import PersistLogin from './shared/PersistLogin';
import Home from './components/home/Home';
import ClientHome from './components/client/ClientHome';
import ClientDashb from './components/client/ClientDashb';
import About from './components/home/About';
import Service from './components/home/Service';
import Support from './components/home/Support';
import Login from './components/auth/Login';
import RequireAuthAdmin from './components/auth/RequireAuthAdmin';
import AdminOverview from './components/admin/subcomponents/AdminOverview';
import AdminDashboard from './components/admin/subcomponents/AdminDashboard';
import { QueryClient, QueryClientProvider } from "react-query";
import AdminTransactions from './components/admin/transactions/AdminTransactions';
import AdminDepositMethod from './components/admin/adminDepositMethod/AdminDepositMethod';
import AdminDepositMethodDetails from './components/admin/adminDepositMethod/AdminDepositMethodDetails';
import RequireAuth from './components/auth/RequireAuth';
import DepositFlow from './components/client/deposit/DepositFlow'
import DepositMethods from './components/client/deposit/DepositMethods';
import DepositMethodDetails from './components/client/deposit/DepositMethodDetails';
import AdminDeposits from './components/admin/deposits/AdminDeposits';
import AdminWithdrawals from './components/admin/withdrawals/AdminWithdrawals';
import Withdrawals from './components/client/withdrawal/Withdrawals';
import WithdrawFlow from './components/client/withdrawal/WithdrawFlow';
import WithdrawalAccounts from './components/client/withdrawal/WithdrawalAccounts';
import AdminInvestmentPlans from './components/admin/investmentPlans/AdminInvestmentPlans';
import InvestmentPlans from './components/client/investment/InvestmentPlans';
import InvestmentPlanDetails from './components/client/investment/InvestmentPlanDetails';
import AdminInvestments from './components/admin/investments/AdminInvestments';
import AdminClientDetails from './components/admin/adminClient/AdminClientDetails';
import TransactionDetails from './components/client/subComponents/TransactionDetails';
import TransactionHistory from './components/client/subComponents/TransactionHistory';
import Profile from './components/client/subComponents/Profile';
import Deposits from './components/client/deposit/Deposits';
import Investments from './components/client/investment/Investments';
import Loader from './components/utils/Loader';
import ScrollToTop from './components/utils/ScrollToTop';
import ScrollToTopButton from './components/utils/ScrollToTopButton';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Page404 from './components/views/Page404';
import UnAuthorized from './components/views/Unauthorized';
import Notification from './components/client/notifications/Notification';
import AdminClients from './components/admin/adminClient/AdminClients';
import TradeLog from './components/admin/trades/TradeLog';
import DueTrades from './components/admin/trades/DueTrades';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import PrivacyPolicy from './components/home/pages/PrivacyPolicy';
import DepositProcess from './components/client/guides/DepositProcess';
import MessageReq from './components/admin/messages/MessageReq';
import AdminTransactionDetails from './components/admin/transactions/AdminTransactionDetails';
import ChangePassword from './components/auth/ChangePassword';
import AdminProfile from './components/admin/subcomponents/AdminProfile';
import Layout from './components/home/Layout';
import BlogDetails from './components/home/pages/BlogDetails';
import SignUpProcess from './components/home/pages/SignUpProcess';
import PlanUpgrades from './components/admin/planUpgrades/PlanUpgrades'
import RejectedTrades from './components/admin/trades/RejectedTrades'
import KYCStatus from './components/client/kyc/KYCStatus'
import AdminKYCReview from './components/admin/kyc/AdminKYCReview'
import AdminKYCList from './components/admin/kyc/AdminKYCList'
import AdminUnlockRequests from './components/admin/unlock/AdminUnlockRequests'
import Mining from './components/client/mining/Mining'
import AdminMiningMachines from './components/admin/mining/AdminMiningMachines'
import AdminServiceRequests from './components/admin/services/AdminServiceRequests'
import AdminEmailCenter from './components/admin/email/AdminEmailCenter'
import WelcomePage from './components/client/WelcomePage'

function App() {
  const queryClient = new QueryClient();
  const roles = { client: "Client", admin: "Admin", cordinator: "Cordinator"};
  return (
    <QueryClientProvider client={queryClient}>
    <>
      <ScrollToTopButton />
      <ScrollToTop />
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path='/' element={<Home />}>
          <Route index element={<Layout />}/>
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Service />} />
          <Route path='/support' element={<Support />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/signup-process' element={<SignUpProcess />} />
          <Route path="/blog-details" element={<BlogDetails />} />
        </Route>
      </Route>

      <Route path='/auth/admin/login' element={<Login />} />
      <Route path='/loader' element={<Loader />} />
      <Route path='/auth/user/login' element={<SignIn />} />
      <Route path='/register' element={<SignUp />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />

      <Route element={<PersistLogin />}>
        <Route element={<RequireAuthAdmin allowedRoles={[roles.admin]} />}>
          <Route path='/admin' element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path='/admin/profile/:id' element={<AdminProfile />} />
            <Route path='/admin/clients' element={<AdminClients />} />
            <Route path='/admin/transactions' element={<AdminTransactions />} />
            <Route path='/admin/transaction-overview/:id' element={<AdminTransactionDetails />} />
            <Route path='/admin/deposits' element={<AdminDeposits />} />
            <Route path='/admin/withdrawals' element={<AdminWithdrawals />} />
            <Route path='/admin/investments' element={<AdminInvestments />} />
            <Route path='/admin/change-password' element={<ChangePassword />} />
            <Route path='/admin/depositmethods' element={<AdminDepositMethod />} />
            <Route path='/admin/depositmethod/:id' element={<AdminDepositMethodDetails />} />
            <Route path='/admin/investmentplans' element={<AdminInvestmentPlans />} />
            <Route path='/admin/client_details/:id' element={<AdminClientDetails />} />
            <Route path='/admin/trades' element={<TradeLog />} />
            <Route path='/admin/trades/due' element={<DueTrades />} />
            <Route path='/admin/trades/rejected' element={<RejectedTrades />} />
            <Route path='/admin/message-requests' element={<MessageReq />} />
            <Route path='/admin/plan-upgrades' element={<PlanUpgrades />} />
            <Route path='/admin/kyc/review' element={<AdminKYCReview />} />
            <Route path='/admin/kyc/all' element={<AdminKYCList />} />
            <Route path='/admin/unlock-requests' element={<AdminUnlockRequests />} />
            <Route path='/admin/mining-machines' element={<AdminMiningMachines />} />
            <Route path='/admin/service-requests' element={<AdminServiceRequests />} />
            <Route path='/admin/email-center' element={<AdminEmailCenter />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[roles.client]} />}>
          <Route path='/welcome' element={<WelcomePage />} />
          <Route path='/user' element={<ClientHome />}>
            <Route index element={<ClientDashb />} />
            <Route path='/user/profile/:id' element={<Profile />} />
            <Route path='/user/transaction/:id' element={<TransactionDetails />} />
            <Route path='/user/transactions' element={<TransactionHistory />} />
            <Route path='/user/deposits' element={<Deposits />} />
            <Route path='/user/depositmethod' element={<DepositMethods />} />
            <Route path='/user/deposit-flow' element={<DepositFlow />} />
            <Route path='/user/depositmethod/:id' element={<DepositMethodDetails />} />
            <Route path='/user/withdrawals' element={<Withdrawals />} />
            <Route path='/user/withdraw-flow' element={<WithdrawFlow />} />
            <Route path='/user/withdrawal-accounts' element={<WithdrawalAccounts />} />
            <Route path='/user/investments' element={<Investments />} />
            <Route path='/user/investmentplan' element={<InvestmentPlans />} />
            <Route path='/user/investmentplan/:id' element={<InvestmentPlanDetails />} />
            <Route path='/user/notifications' element={<Notification />} />
            <Route path='/user/deposit-process' element={<DepositProcess />} />
            <Route path='/user/change-password' element={<ChangePassword />} />
            <Route path='/user/kyc/status' element={<KYCStatus />} />
            <Route path='/user/mining' element={<Mining />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Page404 />} />
      <Route path="unauthorized" element={<UnAuthorized />} />
    </Routes>
    </>
    </QueryClientProvider>
  )
}

export default App
