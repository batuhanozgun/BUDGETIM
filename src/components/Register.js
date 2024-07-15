import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, sendEmailVerification, setDoc, doc } from '../firebase-config';
import Header from './Header';
import Message from './Message';
import { getErrorMessage } from '../utils/errorMessages';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        isAdmin: false, // Varsayılan olarak admin değil
        verified: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        browser: navigator.userAgent
      });

      setSuccess('Registration successful! Please verify your email.');
      navigate('/login');
    } catch (error) {
      console.error("Firebase registration error:", error);
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
          <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
          <button type="submit">Register</button>
          {error && <Message type="error" message={error} />}
          {success && <Message type="success" message={success} />}
        </form>
      </div>
    </div>
  );
}

export default Register;
