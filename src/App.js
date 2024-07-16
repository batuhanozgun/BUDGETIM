import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, db, onAuthStateChanged, doc, getDoc } from './firebase-config';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ManageAccounts from './components/ManageAccounts';
import ManageAccountsLayout from './components/ManageAccountsLayout';
import CashAccounts from './components/CashAccounts';
import BankAccounts from './components/BankAccounts';
import CreditCards from './components/CreditCards';
import Loans from './components/Loans';
import FinancialTransactions from './components/FinancialTransactions';
import Profile from './components/Profile';
import ProfileDetails from './components/ProfileDetails';
import ProfileSettings from './components/ProfileSettings';
import FAQ from './components/FAQ';
import PasswordReset from './components/PasswordReset';
import AdminLayout from './components/AdminLayout';
import Admin from './components/Admin';
import Users from './components/Users';
import AccountTypes from './components/AccountTypes';
import TransactionTypes from './components/TransactionTypes';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import UserTypes from './components/UserTypes';
import './global.css'; // Global CSS dosyasını dahil edin
import './index.css';  // Optimize edilmiş index.css dosyasını dahil edin

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.isAdmin || false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-accounts" element={<ManageAccountsLayout />}>
            <Route path="cash" element={<CashAccounts />} />
            <Route path="bank" element={<BankAccounts />} />
            <Route path="credit" element={<CreditCards />} />
            <Route path="loans" element={<Loans />} />
          </Route>
          <Route path="/financial-transaction" element={<FinancialTransactions />} />
          <Route path="/profile" element={<Profile />}>
            <Route path="details" element={<ProfileDetails />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>
          <Route path="/faq" element={<FAQ />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Login />}>
            <Route index element={<Admin />} />
            <Route path="users" element={<Users />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="account-types" element={<AccountTypes />} />
            <Route path="transaction-types" element={<TransactionTypes />} />
            <Route path="user-types" element={<UserTypes />} />
            <Route path="edit-user/:userId" element={<EditUser />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
