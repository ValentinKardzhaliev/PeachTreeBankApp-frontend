import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/LogoutButton.module.css';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8000/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');
      await logout();
    } catch (err) {
      console.error(err);
      alert('Error logging out.');
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
  );
};

export default LogoutButton;
