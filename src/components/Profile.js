import React from 'react';
import { Outlet } from 'react-router-dom';
import './Profile.css'; // Menü stilleri için
import ProfileMenu from './ProfileMenu';

const Profile = () => {
  return (
    <div className="profile-page content">
      <ProfileMenu />
      <Outlet />
    </div>
  );
}

export default Profile;
