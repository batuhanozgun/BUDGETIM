import React, { useState } from 'react';
import { db, doc, updateDoc } from '../firebase-config';
import Message from './Message';

const EditCashAccount = ({ account, onClose, onUpdate }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [initialBalance, setInitialBalance] = useState(account.initialBalance);
  const [startDate, setStartDate] = useState(account.startDate);
  const [currency, setCurrency] = useState(account.currency);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'cashAccounts', account.id), {
        accountName,
        initialBalance: parseFloat(initialBalance),
        startDate,
        currency,
      });
      onUpdate();
      onClose();
      setMessage({ type: 'success', content: 'Cash account updated successfully' });
    } catch (error) {
      console.error('Error updating cash account: ', error);
      setMessage({ type: 'error', content: 'Failed to update cash account' });
    }
  };

  return (
    <div className="edit-cash-account-modal">
      <div className="edit-cash-account-form">
        <form onSubmit={handleSubmit}>
          <h2>Edit Cash Account</h2>
          {message.content && <Message type={message.type} message={message.content} />}
          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="initialBalance">Initial Balance</label>
            <input
              type="number"
              id="initialBalance"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="TL">TL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditCashAccount;
