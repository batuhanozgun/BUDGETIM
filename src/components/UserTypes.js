import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase-config';
import AdminMenu from './AdminMenu';
import './UserTypes.css';

const UserTypes = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [newUserType, setNewUserType] = useState('');

  useEffect(() => {
    const fetchUserTypes = async () => {
      const userTypesCollection = collection(db, 'userTypes');
      const userTypesSnapshot = await getDocs(userTypesCollection);
      const userTypesList = userTypesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserTypes(userTypesList);
    };

    fetchUserTypes();
  }, []);

  const handleAddUserType = async () => {
    if (newUserType.trim() === '') return;
    try {
      const docRef = await addDoc(collection(db, 'userTypes'), { name: newUserType });
      setUserTypes([...userTypes, { id: docRef.id, name: newUserType }]);
      setNewUserType('');
    } catch (error) {
      console.error("Error adding user type: ", error);
    }
  };

  const handleDeleteUserType = async (id) => {
    try {
      await deleteDoc(doc(db, 'userTypes', id));
      setUserTypes(userTypes.filter(userType => userType.id !== id));
    } catch (error) {
      console.error("Error deleting user type: ", error);
    }
  };

  return (
    <div className="user-types-page content">
      <AdminMenu />
      <div className="user-types">
        <h2>User Types</h2>
        <input
          type="text"
          value={newUserType}
          onChange={(e) => setNewUserType(e.target.value)}
          placeholder="New User Type"
        />
        <button onClick={handleAddUserType}>Add User Type</button>
        <ul>
          {userTypes.map(userType => (
            <li key={userType.id}>
              {userType.name}
              <button onClick={() => handleDeleteUserType(userType.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserTypes;
