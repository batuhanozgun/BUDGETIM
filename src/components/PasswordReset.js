import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase-config';
import { getErrorMessage } from '../utils/errorMessages';
import Message from './Message';
import Header from './Header';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error("Firebase password reset error:", error); // Hata mesajını konsola basma
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      <Header />
      <form onSubmit={handlePasswordReset}>
        <h2>Reset Password</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Send Password Reset Email</button>
        {error && <Message type="error" message={error} />}
        {success && <Message type="success" message={success} />}
      </form>
    </div>
  );
}

export default PasswordReset;
