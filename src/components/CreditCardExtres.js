import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../firebase-config';
import Message from './Message';
import './CreditCardExtres.css';

const CreditCardExtres = () => {
  const [extresPlans, setExtresPlans] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    const fetchExtresPlans = async () => {
      try {
        const plansCollection = collection(db, 'creditCards');
        const plansSnapshot = await getDocs(plansCollection);
        const plansList = [];
        for (const cardDoc of plansSnapshot.docs) {
          const extresCollection = collection(db, 'creditCards', cardDoc.id, 'CreditCardExtresPlans');
          const extresSnapshot = await getDocs(extresCollection);
          extresSnapshot.forEach(doc => {
            plansList.push({ id: doc.id, ...doc.data(), cardId: cardDoc.id });
          });
        }
        setExtresPlans(plansList);
      } catch (error) {
        console.error('Error fetching extres plans: ', error);
        setMessage({ type: 'error', content: 'Failed to fetch extres plans' });
      }
    };

    fetchExtresPlans();
  }, []);

  return (
    <div className="credit-card-extres-page content">
      <h2>Credit Card Extres</h2>
      {message.content && <Message type={message.type} message={message.content} />}
      <ul>
        {extresPlans.map(plan => (
          <li key={plan.id}>
            <span>Card ID: {plan.cardId}</span>
            <span>Cut Date: {new Date(plan.cutDate.seconds * 1000).toLocaleDateString()}</span>
            <span>Payment Date: {new Date(plan.paymentDate.seconds * 1000).toLocaleDateString()}</span>
            <span>Period: {plan.period}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreditCardExtres;
