import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase-config';
import Message from './Message'; // Message bileşenini ekliyoruz
import EditCashAccount from './EditCashAccount'; // EditCashAccount bileşenini ekliyoruz
import './CashAccounts.css'; // CSS dosyasını dahil ediyoruz

const CashAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [startDate, setStartDate] = useState('');
  const [currency, setCurrency] = useState('TL');
  const [message, setMessage] = useState({ type: '', content: '' }); // Mesaj durumu ekliyoruz
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accountsCollection = collection(db, 'cashAccounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsList = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(accountsList);
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'cashAccounts'), {
        accountName,
        initialBalance: parseFloat(initialBalance),
        startDate,
        currency,
      });
      setAccounts([...accounts, { id: docRef.id, accountName, initialBalance: parseFloat(initialBalance), startDate, currency }]);
      setAccountName('');
      setInitialBalance('');
      setStartDate('');
      setCurrency('TL');
      setMessage({ type: 'success', content: 'Cash account created successfully' });
    } catch (error) {
      console.error('Error creating cash account: ', error);
      setMessage({ type: 'error', content: 'Failed to create cash account' });
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await deleteDoc(doc(db, 'cashAccounts', id));
      setAccounts(accounts.filter(account => account.id !== id));
      setMessage({ type: 'success', content: 'Cash account deleted successfully' });
    } catch (error) {
      console.error('Error deleting cash account: ', error);
      setMessage({ type: 'error', content: 'Failed to delete cash account' });
    }
  };

  const handleUpdateAccount = () => {
    const fetchAccounts = async () => {
      const accountsCollection = collection(db, 'cashAccounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsList = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(accountsList);
    };

    fetchAccounts();
  };

  return (
    <div className="cash-accounts-page content">
      <div className="cash-accounts-form">
        <form onSubmit={handleSubmit}>
          <h2>Create New Cash Account</h2>
          {message.content && <Message type={message.type} message={message.content} />} {/* Mesajı gösteriyoruz */}
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
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="cash-accounts-list">
        <h2>Existing Cash Accounts</h2>
        <ul>
          {accounts.map(account => (
            <li key={account.id}>
              <span>{account.accountName} (Balance: {account.initialBalance} {account.currency}, Start Date: {account.startDate})</span>
              <button className="edit" onClick={() => setEditingAccount(account)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editingAccount && (
        <EditCashAccount
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onUpdate={handleUpdateAccount}
        />
      )}
    </div>
  );
}

export default CashAccounts;
