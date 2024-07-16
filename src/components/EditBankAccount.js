import React, { useState, useEffect } from 'react';
import { db, doc, updateDoc } from '../firebase-config';
import Message from './Message';

const EditBankAccount = ({ account, onClose, onUpdate }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [initialBalance, setInitialBalance] = useState(account.initialBalance);
  const [startDate, setStartDate] = useState(account.startDate);
  const [currency, setCurrency] = useState(account.currency);
  const [overdraft, setOverdraft] = useState(account.overdraft || 'No');
  const [overdraftLimit, setOverdraftLimit] = useState(account.overdraftLimit || '');
  const [overdraftInterestRate, setOverdraftInterestRate] = useState(account.overdraftInterestRate || '');
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    if (overdraft === 'No') {
      setOverdraftLimit('');
      setOverdraftInterestRate('');
    }
  }, [overdraft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialBalance < 0 && overdraft === 'No') {
      setMessage({ type: 'error', content: 'Initial balance cannot be negative without Overdraft Limit' });
      return;
    }
    try {
      await updateDoc(doc(db, 'bankAccounts', account.id), {
        accountName,
        initialBalance: parseFloat(initialBalance),
        startDate,
        currency,
        overdraft,
        overdraftLimit: overdraft === 'Yes' ? parseFloat(overdraftLimit) : null,
        overdraftInterestRate: overdraft === 'Yes' ? parseFloat(overdraftInterestRate) : null,
      });
      onUpdate();
      onClose();
      setMessage({ type: 'success', content: 'Bank account updated successfully' });
    } catch (error) {
      console.error('Error updating bank account: ', error);
      setMessage({ type: 'error', content: 'Failed to update bank account' });
    }
  };

  return (
    <div className="edit-bank-account-modal">
      <div className="edit-bank-account-form">
        <form onSubmit={handleSubmit}>
          <h2>Edit Bank Account</h2>
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
              {/* Diğer para birimlerini de ekleyebilirsiniz */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="overdraft">Overdraft Facility</label>
            <select
              id="overdraft"
              value={overdraft}
              onChange={(e) => setOverdraft(e.target.value)}
              required
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {overdraft === 'Yes' && (
            <>
              <div className="form-group">
                <label htmlFor="overdraftLimit">Overdraft Limit</label>
                <input
                  type="number"
                  id="overdraftLimit"
                  value={overdraftLimit}
                  onChange={(e) => setOverdraftLimit(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="overdraftInterestRate">Overdraft Interest Rate (%)</label>
                <input
                  type="number"
                  id="overdraftInterestRate"
                  value={overdraftInterestRate}
                  onChange={(e) => setOverdraftInterestRate(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditBankAccount;
