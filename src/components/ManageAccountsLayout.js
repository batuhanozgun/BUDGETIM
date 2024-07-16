import React from 'react';
import { Outlet } from 'react-router-dom';
import ManageAccountsMenu from './ManageAccountsMenu';
import './ManageAccountsLayout.css';

const ManageAccountsLayout = () => {
  return (
    <div className="manage-accounts-layout">
      <ManageAccountsMenu />
      <div className="manage-accounts-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ManageAccountsLayout;
