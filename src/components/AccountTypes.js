import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase-config';
import AdminMenu from './AdminMenu';
import Message from './Message'; // Message bileşenini ekliyoruz
import './AccountTypes.css';

const AccountTypes = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [typeName, setTypeName] = useState('');
  const [order, setOrder] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' }); // Mesaj durumu ekliyoruz

  useEffect(() => {
    const fetchAccountTypes = async () => {
      const accountTypesCollection = collection(db, 'accountTypes');
      const accountTypesSnapshot = await getDocs(accountTypesCollection);
      const accountTypesList = accountTypesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccountTypes(accountTypesList);
    };

    fetchAccountTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'accountTypes'), {
        typeName,
        order: parseInt(order, 10),
      });
      setAccountTypes([...accountTypes, { id: docRef.id, typeName, order: parseInt(order, 10) }]);
      setTypeName('');
      setOrder('');
      setMessage({ type: 'success', content: 'Account type created successfully' });
    } catch (error) {
      console.error('Error creating account type: ', error);
      setMessage({ type: 'error', content: 'Failed to create account type' });
    }
  };

  const handleDeleteAccountType = async (id) => {
    try {
      await deleteDoc(doc(db, 'accountTypes', id));
      setAccountTypes(accountTypes.filter(accountType => accountType.id !== id));
      setMessage({ type: 'success', content: 'Account type deleted successfully' });
    } catch (error) {
      console.error('Error deleting account type: ', error);
      setMessage({ type: 'error', content: 'Failed to delete account type' });
    }
  };

  return (
    <div className="account-types-page content">
      <AdminMenu />
      <div className="account-types-form">
        <form onSubmit={handleSubmit}>
          <h2>Create Account Type</h2>
          {message.content && <Message type={message.type} message={message.content} />} {/* Mesajı gösteriyoruz */}
          <div className="form-group">
            <label htmlFor="typeName">Type Name</label>
            <input
              type="text"
              id="typeName"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="account-types-list">
        <h2>Existing Account Types</h2>
        <ul>
          {accountTypes.map(accountType => (
            <li key={accountType.id}>
              <span>{accountType.typeName} (Order: {accountType.order})</span>
              <button onClick={() => handleDeleteAccountType(accountType.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AccountTypes;
