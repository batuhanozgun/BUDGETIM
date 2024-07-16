import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, collection, getDocs, updateDoc, doc, deleteDoc, functions, httpsCallable, signInWithEmailAndPassword } from '../firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [authUsers, setAuthUsers] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    const fetchAuthUsers = async () => {
      try {
        const response = await fetch('https://us-central1-budgetim001.cloudfunctions.net/listAllUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setAuthUsers(data.users);
      } catch (error) {
        console.error("Error fetching auth users: ", error);
      }
    };

    fetchUsers();
    fetchAuthUsers();
  }, []);

  const handleAdminToggle = async (userId, isAdmin) => {
    await updateDoc(doc(db, 'users', userId), { isAdmin: !isAdmin });
    setUsers(users.map(user => user.id === userId ? { ...user, isAdmin: !isAdmin } : user));
  };

  const handleUserTypeChange = async (userId, userType) => {
    await updateDoc(doc(db, 'users', userId), { userType });
    setUsers(users.map(user => user.id === userId ? { ...user, userType } : user));
  };

  const handlePasswordReset = async (email) => {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent');
  };

  const handleUserBlock = async (userId, isBlocked) => {
    await updateDoc(doc(db, 'users', userId), { isBlocked: !isBlocked });
    setUsers(users.map(user => user.id === userId ? { ...user, isBlocked: !isBlocked } : user));
  };

  const handleUserDelete = async (userId) => {
    if (!userId) {
      alert('Geçerli bir kullanıcı kimliği yok');
      return;
    }
    try {
      // Admin şifresi doğrulaması
      const adminEmail = auth.currentUser.email;
      const adminPassword = prompt("Lütfen admin şifrenizi girin:");
      if (!adminPassword) {
        alert('Admin şifresini giriniz');
        return;
      }
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      // Firebase Function'ı çağır
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      const result = await deleteUserFunction({ uid: userId });
      console.log("Delete user result:", result);

      // Kullanıcıyı Firestore'dan sil
      await deleteDoc(doc(db, 'users', userId));

      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert('Error deleting user: ' + error.message);
    }
  };

  return (
    <div className="content">
      <h2>Users</h2>
      <div className="admin-password-input">
        <input 
          type="password" 
          placeholder="Enter admin password" 
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Type</th>
            <th>Admin</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.userType}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>{user.isBlocked ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleAdminToggle(user.id, user.isAdmin)}>Toggle Admin</button>
                <button onClick={() => handleUserTypeChange(user.id, 'Basic')}>Set Basic</button>
                <button onClick={() => handleUserTypeChange(user.id, 'Premium')}>Set Premium</button>
                <button onClick={() => handlePasswordReset(user.email)}>Reset Password</button>
                <button onClick={() => handleUserBlock(user.id, user.isBlocked)}>Toggle Block</button>
                <button onClick={() => handleUserDelete(user.id)}>Delete User</button>
                <Link to={`/admin/edit-user/${user.id}`}><button>Edit User</button></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Authentication Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>UID</th>
            <th>Email</th>
            <th>Display Name</th>
            <th>Phone Number</th>
            <th>Provider</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authUsers.map(user => (
            <tr key={user.uid}>
              <td>{user.uid}</td>
              <td>{user.email}</td>
              <td>{user.displayName}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.providerId}</td>
              <td>
                <button onClick={() => handlePasswordReset(user.email)}>Reset Password</button>
                <button onClick={() => handleUserDelete(user.uid)}>Delete User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
