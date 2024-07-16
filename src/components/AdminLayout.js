import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminMenu />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
