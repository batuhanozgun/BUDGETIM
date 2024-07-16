import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, collection, getDocs, doc, getDoc, updateDoc, setDoc } from '../firebase-config';
import Message from './Message'; // Message bileşenini import ediyoruz
import { getErrorMessage } from '../utils/errorMessages'; // Hata mesajlarını almak için fonksiyonu import ediyoruz
import './EditUser.css';

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [allFields, setAllFields] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [message, setMessage] = useState(''); // Mesaj state'i ekliyoruz
  const [messageType, setMessageType] = useState(''); // Mesaj tipi state'i ekliyoruz

  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const fieldsSet = new Set();
      usersSnapshot.forEach((doc) => {
        Object.keys(doc.data()).forEach((field) => fieldsSet.add(field));
      });
      console.log("All fields:", [...fieldsSet]);
      setAllFields([...fieldsSet]);
    };

    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
      } else {
        console.error("No such user!");
      }
      setLoading(false);
    };

    const fetchUserTypes = async () => {
      const userTypesCollection = collection(db, 'userTypes');
      const userTypesSnapshot = await getDocs(userTypesCollection);
      const userTypesList = userTypesSnapshot.docs.map(doc => doc.data().name);
      setUserTypes(userTypesList);
    };

    fetchAllUsers();
    fetchUser();
    fetchUserTypes();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', userId), user, { merge: true });
      setMessage('User updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error("Error updating user: ", error);
      const errorMessage = getErrorMessage(error.code);
      setMessage(errorMessage);
      setMessageType('error');
    }
  };

  const renderField = (field) => {
    let value = user[field] || '';
    const type = typeof value;

    if (type === 'object' && value.toDate) {
      value = value.toDate().toISOString().split('T')[0]; // Tarih alanlarını doğru formatta gösteriyoruz
    }

    if (field === 'isAdmin' || field === 'isBlocked' || type === 'boolean') {
      return (
        <label key={field}>
          {field}:
          <input
            type="checkbox"
            name={field}
            checked={!!value}
            onChange={handleChange}
          />
        </label>
      );
    } else if (field === 'userType') {
      return (
        <label key={field}>
          {field}:
          <select name={field} value={value} onChange={handleChange}>
            {userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      );
    } else if (field === 'email') {
      return (
        <label key={field}>
          {field}:
          <input
            type="email"
            name={field}
            value={value}
            onChange={handleChange}
          />
        </label>
      );
    } else if (field === 'createdAt' || field === 'lastLogin') {
      // Tarih alanlarını sadece gösteriyoruz, düzenleme yapmıyoruz
      return (
        <label key={field}>
          {field}: {value}
        </label>
      );
    } else if (field === 'browser') {
      // browser alanını sadece gösteriyoruz, düzenleme yapmıyoruz
      return (
        <label key={field}>
          {field}: {value}
        </label>
      );
    } else {
      return (
        <label key={field}>
          {field}:
          <input
            type="text"
            name={field}
            value={value}
            onChange={handleChange}
          />
        </label>
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-user content">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        {message && <Message type={messageType} message={message} />} {/* Mesajı formun içinde, üstte gösteriyoruz */}
        {allFields.map((field) => renderField(field))}
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default EditUser;
