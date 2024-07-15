import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase-config';
import Header from './Header';
import { getErrorMessage } from '../utils/errorMessages';
import Message from './Message';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        await auth.signOut();
        return;
      }

      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Firebase login error:", error); // Hata mesajını konsola basma
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <Link to="/password-reset" className="forgot-password-link">Forgot Password?</Link>
          {error && <Message type="error" message={error} />}
          {success && <Message type="success" message={success} />}
        </form>
      </div>
    </div>
  );
}

export default Login;
