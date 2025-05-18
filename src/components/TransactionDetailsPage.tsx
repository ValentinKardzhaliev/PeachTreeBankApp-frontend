import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import TransactionForm from './TransactionForm';
import styles from '../styles/TransactionDetailsPage.module.css';

interface Transaction {
  id: number;
  date: string;
  from_account: string;
  to_account: string;
  amount: number;
  status: 'red' | 'yellow' | 'green';
}

const STATUS_OPTIONS: Transaction['status'][] = ['red', 'yellow', 'green'];

const TransactionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Transaction['status']>('red');
  const location = useLocation();
  const transactionId = new URLSearchParams(location.search).get('transaction_id')!;

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:8000/transactions/${transactionId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json() as Transaction;
        setTransaction(data);
        setSelectedStatus(data.status);
      }
    })();
  }, [transactionId]);

  const updateStatus = async () => {
    if (!transaction) return;
    const res = await fetch(`http://localhost:8000/transactions/${transaction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: selectedStatus })
    });
    if (res.ok) {
      const updated = await res.json() as Transaction;
      setTransaction(updated);
      alert('Status updated successfully!');
    } else {
      alert('Failed to update status.');
    }
  };

  if (!transaction) return <p className={styles.loadingText}>Loading…</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <TransactionForm onSuccess={() => window.location.reload()} />
      </aside>

      <main className={styles.main}>
        <div className={styles.logoutButtonContainer}>
          <LogoutButton />
          <button
            className={styles.homeButton}
            onClick={() => navigate('/')}
          >
            Home
          </button>
        </div>
        <h2 className={styles.detailsHeader}>Details for #{transaction.id}</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.transactionTable}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>Amount</td>
                <td className={styles.valueCell}>${transaction.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Date</td>
                <td className={styles.valueCell}>{new Date(transaction.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>To Contractor</td>
                <td className={styles.valueCell}>{transaction.to_account}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Status</td>
                <td className={styles.valueCell}>
                  <select
                    className={styles.statusSelect}
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value as Transaction['status'])}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className={styles.statusSaveButton} onClick={updateStatus}>
                    Save Status
                  </button>
                </td>
              </tr>
              <tr className={styles.legendRow}>
                <td colSpan={2}>
                  <div className={styles.legend}>
                    <span className={`${styles.legendDot} ${styles.red}`} /> Sent
                    <span className={`${styles.legendDot} ${styles.yellow}`} /> Received
                    <span className={`${styles.legendDot} ${styles.green}`} /> Paid
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TransactionDetailsPage;
