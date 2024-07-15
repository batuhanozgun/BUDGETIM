import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, onAuthStateChanged, doc, getDoc, signOut } from '../firebase-config';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
          setIsAdmin(userData.isAdmin || false); // Admin durumunu belirliyoruz
        }
      } else {
        setUser(null);
        setUserName('');
        setIsAdmin(false); // Kullanıcı çıkış yaparsa admin durumunu sıfırla
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="header">
      <h1>BUDGETIM</h1>
      {user ? (
        <>
          <p>Hello, {userName}</p>
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/manage-accounts">Manage Accounts</Link>
            <Link to="/financial-transaction">Financial Transaction</Link>
            <Link to="/profile">Profile</Link>
            {isAdmin && <Link to="/admin">Admin</Link>} {/* Admin kullanıcılar için Admin linki */}
            <Link to="/logout" onClick={handleLogout}>Logout</Link>
            <Link to="/faq">FAQ</Link>
          </nav>
        </>
      ) : (
        <nav>
          <Link to="/">Register</Link> {/* Register linki doğru yola yönlendirildi */}
          <Link to="/login">Login</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
      )}
    </div>
  );
}

export default Header;
