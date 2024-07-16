import React from 'react';
import { Link } from 'react-router-dom';
import './ManageAccountsMenu.css';

const ManageAccountsMenu = () => {
  return (
    <div className="manage-accounts-menu">
      <nav>
        <Link to="/manage-accounts/cash">Cash Accounts</Link>
        <Link to="/manage-accounts/bank">Bank Accounts</Link>
        <Link to="/manage-accounts/credit">Credit Cards</Link>
        <Link to="/manage-accounts/loans">Loans</Link>
      </nav>
    </div>
  );
}

export default ManageAccountsMenu;
