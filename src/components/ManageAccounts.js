import React from 'react';
import { Outlet } from 'react-router-dom';
import ManageAccountsLayout from './ManageAccountsLayout';

const ManageAccounts = () => {
  return (
    <ManageAccountsLayout>
      <Outlet />
    </ManageAccountsLayout>
  );
}

export default ManageAccounts;
