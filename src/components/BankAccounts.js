import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase-config';
import Message from './Message'; // Message bileşenini ekliyoruz
import EditBankAccount from './EditBankAccount'; // EditBankAccount bileşenini ekliyoruz
import './BankAccounts.css'; // CSS dosyasını dahil ediyoruz

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [startDate, setStartDate] = useState('');
  const [currency, setCurrency] = useState('TL');
  const [overdraft, setOverdraft] = useState('No');
  const [overdraftLimit, setOverdraftLimit] = useState('');
  const [overdraftInterestRate, setOverdraftInterestRate] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' }); // Mesaj durumu ekliyoruz
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accountsCollection = collection(db, 'bankAccounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsList = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(accountsList);
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialBalance < 0 && overdraft === 'No') {
      setMessage({ type: 'error', content: 'Initial balance cannot be negative without Overdraft Limit' });
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'bankAccounts'), {
        accountName,
        initialBalance: parseFloat(initialBalance),
        startDate,
        currency,
        overdraft,
        overdraftLimit: overdraft === 'Yes' ? parseFloat(overdraftLimit) : null,
        overdraftInterestRate: overdraft === 'Yes' ? parseFloat(overdraftInterestRate) : null,
      });
      setAccounts([...accounts, {
        id: docRef.id,
        accountName,
        initialBalance: parseFloat(initialBalance),
        startDate,
        currency,
        overdraft,
        overdraftLimit: overdraft === 'Yes' ? parseFloat(overdraftLimit) : null,
        overdraftInterestRate: overdraft === 'Yes' ? parseFloat(overdraftInterestRate) : null,
      }]);
      setAccountName('');
      setInitialBalance('');
      setStartDate('');
      setCurrency('TL');
      setOverdraft('No');
      setOverdraftLimit('');
      setOverdraftInterestRate('');
      setMessage({ type: 'success', content: 'Bank account created successfully' });
    } catch (error) {
      console.error('Error creating bank account: ', error);
      setMessage({ type: 'error', content: 'Failed to create bank account' });
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await deleteDoc(doc(db, 'bankAccounts', id));
      setAccounts(accounts.filter(account => account.id !== id));
      setMessage({ type: 'success', content: 'Bank account deleted successfully' });
    } catch (error) {
      console.error('Error deleting bank account: ', error);
      setMessage({ type: 'error', content: 'Failed to delete bank account' });
    }
  };

  const handleUpdateAccount = () => {
    const fetchAccounts = async () => {
      const accountsCollection = collection(db, 'bankAccounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsList = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(accountsList);
    };

    fetchAccounts();
  };

  return (
    <div className="bank-accounts-page content">
      <div className="bank-accounts-form">
        <form onSubmit={handleSubmit}>
          <h2>Create New Bank Account</h2>
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
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="bank-accounts-list">
        <h2>Existing Bank Accounts</h2>
        <ul>
          {accounts.map(account => (
            <li key={account.id}>
              <span>
                {account.accountName} (Balance: {account.initialBalance} {account.currency}, Start Date: {account.startDate})
                {account.overdraft === 'Yes' && (
                  <>
                    , Overdraft Limit: {account.overdraftLimit}, Overdraft Interest Rate: {account.overdraftInterestRate}%
                  </>
                )}
              </span>
              <button className="edit" onClick={() => setEditingAccount(account)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editingAccount && (
        <EditBankAccount
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onUpdate={handleUpdateAccount}
        />
      )}
    </div>
  );
}

export default BankAccounts;
