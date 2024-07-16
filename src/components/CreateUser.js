import React, { useState, useEffect } from 'react';
import { auth, db, createUserWithEmailAndPassword, setDoc, signInWithEmailAndPassword, doc } from '../firebase-config';
import Message from './Message';
import './CreateUser.css';

function CreateUser() {
  const [message, setMessage] = useState({ type: '', content: '' });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    // Admin kullanıcı bilgilerini sakla
    if (auth.currentUser) {
      setAdminEmail(auth.currentUser.email);
    }
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;

    try {
      // Yeni kullanıcıyı oluştur
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, // UID'yi ekliyoruz
        firstName,
        lastName,
        email,
        userType: 'Basic',
        isAdmin: false,
        isBlocked: false,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      // Admin kullanıcısını tekrar giriş yap
      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      setMessage({ type: 'success', content: 'User created successfully' });
    } catch (error) {
      console.error("Error creating user: ", error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  return (
    <div className="content">
      <form onSubmit={handleCreateUser}>
        <h2>Create User</h2>
        {message.content && <Message type={message.type} message={message.content} />}
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input
          type="password"
          placeholder="Admin Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default CreateUser;
