import React from 'react';
import './ProfileMenu.css'; // Menü stilleri için
import ProfileMenu from './ProfileMenu';

const Profile = () => {
  return (
    <div className="profile-page content">
      <ProfileMenu />
      <h1>Profile</h1>
      <p>Welcome to your profile page.</p>
    </div>
  );
}

export default Profile;
