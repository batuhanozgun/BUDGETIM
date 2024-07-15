import React from 'react';
import { Link } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
  return (
    <div className="admin-menu">
      <nav>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/account-types">Account Types</Link>
        <Link to="/admin/transaction-types">Transaction Types</Link>
      </nav>
    </div>
  );
}

export default AdminMenu;
