import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardMenu.css';

const DashboardMenu = () => {
  return (
    <div className="dashboard-menu">
      <nav>
        <Link to="/dashboard/overview">Overview</Link>
        <Link to="/dashboard/reports">Reports</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
    </div>
  );
}

export default DashboardMenu;
