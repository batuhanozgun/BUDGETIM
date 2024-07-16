import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase-config';
import AdminMenu from './AdminMenu';
import Message from './Message'; // Message bileşenini ekliyoruz
import './TransactionTypes.css'; // CSS dosyasını dahil ediyoruz

const TransactionTypes = () => {
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [typeName, setTypeName] = useState('');
  const [order, setOrder] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' }); // Mesaj durumu ekliyoruz

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      const transactionTypesCollection = collection(db, 'transactionTypes');
      const transactionTypesSnapshot = await getDocs(transactionTypesCollection);
      const transactionTypesList = transactionTypesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactionTypes(transactionTypesList);
    };

    fetchTransactionTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'transactionTypes'), {
        typeName,
        order: parseInt(order, 10),
      });
      setTransactionTypes([...transactionTypes, { id: docRef.id, typeName, order: parseInt(order, 10) }]);
      setTypeName('');
      setOrder('');
      setMessage({ type: 'success', content: 'Transaction type created successfully' });
    } catch (error) {
      console.error('Error creating transaction type: ', error);
      setMessage({ type: 'error', content: 'Failed to create transaction type' });
    }
  };

  const handleDeleteTransactionType = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactionTypes', id));
      setTransactionTypes(transactionTypes.filter(transactionType => transactionType.id !== id));
      setMessage({ type: 'success', content: 'Transaction type deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction type: ', error);
      setMessage({ type: 'error', content: 'Failed to delete transaction type' });
    }
  };

  return (
    <div className="transaction-types-page content">
      <AdminMenu />
      <div className="transaction-types-form">
        <form onSubmit={handleSubmit}>
          <h2>Create Transaction Type</h2>
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
      <div className="transaction-types-list">
        <h2>Existing Transaction Types</h2>
        <ul>
          {transactionTypes.map(transactionType => (
            <li key={transactionType.id}>
              <span>{transactionType.typeName} (Order: {transactionType.order})</span>
              <button onClick={() => handleDeleteTransactionType(transactionType.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TransactionTypes;
