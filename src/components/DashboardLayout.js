import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardMenu from './DashboardMenu';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardMenu />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;