import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileMenu.css';

const ProfileMenu = () => {
  return (
    <div className="profile-menu">
      <nav>
        <Link to="/profile/details">Details</Link>
        <Link to="/profile/settings">Settings</Link>
      </nav>
    </div>
  );
}

export default ProfileMenu;
