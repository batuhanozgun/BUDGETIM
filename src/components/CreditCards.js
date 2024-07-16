import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase-config';
import Message from './Message';
import './CreditCards.css';

const CreditCards = () => {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [limit, setLimit] = useState('');
  const [sharedLimit, setSharedLimit] = useState(false);
  const [sharedCardId, setSharedCardId] = useState('');
  const [minimumPaymentRate, setMinimumPaymentRate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [lateFeeRate, setLateFeeRate] = useState('');
  const [cashAdvanceRate, setCashAdvanceRate] = useState('');
  const [cashAdvanceLateFeeRate, setCashAdvanceLateFeeRate] = useState('');
  const [prevPeriodTotal, setPrevPeriodTotal] = useState('');
  const [prevPeriodPaid, setPrevPeriodPaid] = useState('');
  const [currentPeriodTotal, setCurrentPeriodTotal] = useState('');
  const [currentPeriodPending, setCurrentPeriodPending] = useState('');
  const [currentCutDate, setCurrentCutDate] = useState('');
  const [currentPaymentDate, setCurrentPaymentDate] = useState('');
  const [nextCutDate, setNextCutDate] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [futureInstallments, setFutureInstallments] = useState([]);
  const [newInstallment, setNewInstallment] = useState({ dueDate: '', amount: '' });

  useEffect(() => {
    const fetchCards = async () => {
      const cardsCollection = collection(db, 'creditCards');
      const cardsSnapshot = await getDocs(cardsCollection);
      const cardsList = cardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardsList);
    };

    fetchCards();
  }, []);

  const calculateEkstrePlan = () => {
    let ekstrePlan = [];
    let currentCut = new Date(nextCutDate);
    let currentPayment = new Date(nextPaymentDate);

    for (let i = 0; i < 12; i++) {
      ekstrePlan.push({
        cutDate: new Date(currentCut),
        paymentDate: new Date(currentPayment),
        period: `${currentCut.getMonth() + 1}-${currentCut.getFullYear()}`
      });

      currentCut.setMonth(currentCut.getMonth() + 1);
      currentPayment.setMonth(currentPayment.getMonth() + 1);
    }

    return ekstrePlan;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cardData = {
        cardName,
        limit: parseFloat(limit),
        sharedLimit,
        sharedCardId: sharedLimit ? sharedCardId : null,
        minimumPaymentRate: parseFloat(minimumPaymentRate),
        interestRate: parseFloat(interestRate),
        lateFeeRate: parseFloat(lateFeeRate),
        cashAdvanceRate: parseFloat(cashAdvanceRate),
        cashAdvanceLateFeeRate: parseFloat(cashAdvanceLateFeeRate),
        prevPeriodTotal: parseFloat(prevPeriodTotal),
        prevPeriodPaid: parseFloat(prevPeriodPaid),
        currentPeriodTotal: parseFloat(currentPeriodTotal),
        currentPeriodPending: parseFloat(currentPeriodPending),
        currentCutDate: new Date(currentCutDate),
        currentPaymentDate: new Date(currentPaymentDate),
        nextCutDate: new Date(nextCutDate),
        nextPaymentDate: new Date(nextPaymentDate),
        futureInstallments
      };

      const docRef = await addDoc(collection(db, 'creditCards'), cardData);
      const ekstrePlan = calculateEkstrePlan();
      for (const plan of ekstrePlan) {
        await addDoc(collection(db, 'creditCards', docRef.id, 'CreditCardExtresPlans'), plan);
      }

      setCards([...cards, { id: docRef.id, ...cardData }]);
      setCardName('');
      setLimit('');
      setSharedLimit(false);
      setSharedCardId('');
      setMinimumPaymentRate('');
      setInterestRate('');
      setLateFeeRate('');
      setCashAdvanceRate('');
      setCashAdvanceLateFeeRate('');
      setPrevPeriodTotal('');
      setPrevPeriodPaid('');
      setCurrentPeriodTotal('');
      setCurrentPeriodPending('');
      setCurrentCutDate('');
      setCurrentPaymentDate('');
      setNextCutDate('');
      setNextPaymentDate('');
      setFutureInstallments([]);
      setMessage({ type: 'success', content: 'Credit card created successfully' });
    } catch (error) {
      console.error('Error creating credit card: ', error);
      setMessage({ type: 'error', content: 'Failed to create credit card' });
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteDoc(doc(db, 'creditCards', id));
      setCards(cards.filter(card => card.id !== id));
      setMessage({ type: 'success', content: 'Credit card deleted successfully' });
    } catch (error) {
      console.error('Error deleting credit card: ', error);
      setMessage({ type: 'error', content: 'Failed to delete credit card' });
    }
  };

  const handleAddInstallment = () => {
    setFutureInstallments([...futureInstallments, newInstallment]);
    setNewInstallment({ dueDate: '', amount: '' });
  };

  return (
    <div className="credit-cards-page content">
      <div className="credit-cards-form">
        <form onSubmit={handleSubmit}>
          <h2>Create New Credit Card</h2>
          {message.content && <Message type={message.type} message={message.content} />}
          <div className="form-group">
            <label htmlFor="cardName">Card Name</label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="limit">Limit</label>
            <input
              type="number"
              id="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={sharedLimit}
                onChange={(e) => setSharedLimit(e.target.checked)}
              />
              Shared Limit
            </label>
          </div>
          {sharedLimit && (
            <div className="form-group">
              <label htmlFor="sharedCardId">Select Card to Share Limit With</label>
              <select
                id="sharedCardId"
                value={sharedCardId}
                onChange={(e) => setSharedCardId(e.target.value)}
                required
              >
                <option value="">Select a card</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id}>{card.cardName}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="minimumPaymentRate">Minimum Payment Rate (%)</label>
            <input
              type="number"
              id="minimumPaymentRate"
              value={minimumPaymentRate}
              onChange={(e) => setMinimumPaymentRate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lateFeeRate">Late Fee Rate (%)</label>
            <input
              type="number"
              id="lateFeeRate"
              value={lateFeeRate}
              onChange={(e) => setLateFeeRate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cashAdvanceRate">Cash Advance Rate (%)</label>
            <input
              type="number"
              id="cashAdvanceRate"
              value={cashAdvanceRate}
              onChange={(e) => setCashAdvanceRate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cashAdvanceLateFeeRate">Cash Advance Late Fee Rate (%)</label>
            <input
              type="number"
              id="cashAdvanceLateFeeRate"
              value={cashAdvanceLateFeeRate}
              onChange={(e) => setCashAdvanceLateFeeRate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prevPeriodTotal">Previous Period Total Amount</label>
            <input
              type="number"
              id="prevPeriodTotal"
              value={prevPeriodTotal}
              onChange={(e) => setPrevPeriodTotal(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prevPeriodPaid">Previous Period Paid Amount</label>
            <input
              type="number"
              id="prevPeriodPaid"
              value={prevPeriodPaid}
              onChange={(e) => setPrevPeriodPaid(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentPeriodTotal">Current Period Total Spending</label>
            <input
              type="number"
              id="currentPeriodTotal"
              value={currentPeriodTotal}
              onChange={(e) => setCurrentPeriodTotal(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentPeriodPending">Current Period Pending Spending</label>
            <input
              type="number"
              id="currentPeriodPending"
              value={currentPeriodPending}
              onChange={(e) => setCurrentPeriodPending(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentCutDate">Current Period Cut Date</label>
            <input
              type="date"
              id="currentCutDate"
              value={currentCutDate}
              onChange={(e) => setCurrentCutDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentPaymentDate">Current Period Payment Date</label>
            <input
              type="date"
              id="currentPaymentDate"
              value={currentPaymentDate}
              onChange={(e) => setCurrentPaymentDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nextCutDate">Next Period Cut Date</label>
            <input
              type="date"
              id="nextCutDate"
              value={nextCutDate}
              onChange={(e) => setNextCutDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nextPaymentDate">Next Period Payment Date</label>
            <input
              type="date"
              id="nextPaymentDate"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="futureInstallments">Future Installments</label>
            {futureInstallments.map((installment, index) => (
              <div key={index}>
                <span>{installment.dueDate}: {installment.amount}</span>
              </div>
            ))}
            <div>
              <input
                type="date"
                value={newInstallment.dueDate}
                onChange={(e) => setNewInstallment({ ...newInstallment, dueDate: e.target.value })}
              />
              <input
                type="number"
                value={newInstallment.amount}
                onChange={(e) => setNewInstallment({ ...newInstallment, amount: e.target.value })}
              />
              <button type="button" onClick={handleAddInstallment}>Add Installment</button>
            </div>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="credit-cards-list">
        <h2>Existing Credit Cards</h2>
        <ul>
          {cards.map(card => (
            <li key={card.id}>
              <span>{card.cardName} (Limit: {card.limit})</span>
              <button className="delete" onClick={() => handleDeleteCard(card.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreditCards;
