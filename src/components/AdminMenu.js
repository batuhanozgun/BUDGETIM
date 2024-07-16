import React from 'react';
import { Link } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
  return (
    <div className="admin-menu">
      <nav>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/create-user">Create User</Link>
        <Link to="/admin/account-types">Account Types</Link>
        <Link to="/admin/transaction-types">Transaction Types</Link>
        <Link to="/admin/user-types">User Types</Link> {/* Yeni sayfa için bağlantı */}
      </nav>
    </div>
  );
}

export default AdminMenu;
