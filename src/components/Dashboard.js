import React from 'react';
import './DashboardMenu.css'; // Menü stilleri için
import DashboardMenu from './DashboardMenu';

const Dashboard = () => {
  return (
    <div className="dashboard-page content">
      <DashboardMenu />
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard page.</p>
    </div>
  );
}

export default Dashboard;
