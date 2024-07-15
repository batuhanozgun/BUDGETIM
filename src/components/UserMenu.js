import React from 'react';
import { Link } from 'react-router-dom';
import './UserMenu.css';

function UserMenu() {
  return (
    <div className="user-menu">
      <nav>
        <Link to="/user/dashboard">Dashboard</Link>
        <Link to="/user/profile">Profile</Link>
        <Link to="/user/settings">Settings</Link>
      </nav>
    </div>
  );
}

export default UserMenu;
