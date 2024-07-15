import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, db, onAuthStateChanged, doc, getDoc } from './firebase-config';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ManageAccounts from './components/ManageAccounts';
import FinancialTransactions from './components/FinancialTransactions';
import Profile from './components/Profile';
import FAQ from './components/FAQ';
import PasswordReset from './components/PasswordReset';
import Admin from './components/Admin';
import Users from './components/Users';
import AccountTypes from './components/AccountTypes';
import TransactionTypes from './components/TransactionTypes';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
        });

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.isAdmin || false);
        }
      } else {
        setUser(null);
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
          <Route path="/manage-accounts" element={<ManageAccounts />} />
          <Route path="/financial-transaction" element={<FinancialTransactions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Login />} />
          <Route path="/admin/users" element={isAdmin ? <Users /> : <Login />} />
          <Route path="/admin/account-types" element={isAdmin ? <AccountTypes /> : <Login />} />
          <Route path="/admin/transaction-types" element={isAdmin ? <TransactionTypes /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
