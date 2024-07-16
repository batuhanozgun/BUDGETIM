import React, { useEffect, useState } from 'react';
import { auth, db, doc, getDoc } from '../firebase-config';
import './ProfileDetails.css';

const ProfileDetails = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      }
    };
    fetchUserDetails();
  }, []);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-details">
      <h2>Profile Details</h2>
      <p><strong>First Name:</strong> {userDetails.firstName}</p>
      <p><strong>Last Name:</strong> {userDetails.lastName}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>User Type:</strong> {userDetails.userType}</p>
    </div>
  );
}

export default ProfileDetails;
