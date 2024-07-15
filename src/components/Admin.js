import React from 'react';
import AdminMenu from './AdminMenu';

const Admin = () => {
  return (
    <div className="admin-page content">
      <AdminMenu />
      <h1>Admin Page</h1>
      <p>Welcome to the admin page. Only admin users can see this.</p>
    </div>
  );
}

export default Admin;
