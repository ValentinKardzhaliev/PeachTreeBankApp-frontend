import React, { useEffect, useState } from 'react';
import styles from '../styles/HomePage.module.css';
import LogoutButton from './LogoutButton';
import TransactionForm from './TransactionForm';
import { Link } from 'react-router-dom';

interface Transaction {
  id: number;
  date: string;
  from_account: string;
  to_account: string;
  amount: number;
  status: 'red' | 'yellow' | 'green';
}

const HomePage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'contractor'>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [q, setQ] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort_by: sortBy,
        order,
        ...(q ? { contractor: q } : {}),
        ...(filterDate ? { date: filterDate } : {}),
      });
      const res = await fetch(`http://localhost:8000/transactions/?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Could not load transactions');
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [sortBy, order, q, filterDate]);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <TransactionForm onSuccess={fetchTransactions} />
        </aside>

        <main className={styles.main}>
          <div className={styles.header}>
            <h2 className={styles.title}>Recent Transactions</h2>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.controls}>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
              />
              <input
                placeholder="Search contractor…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              <span className={styles.sortby}>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="contractor">Contractor</option>
              </select>
              <select value={order} onChange={e => setOrder(e.target.value as any)}>
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
              <div className={styles.logoutButtonContainer}><LogoutButton /></div>
            </div>

            {loading ? (
              <p>Loading transactions…</p>
            ) : transactions.length === 0 ? (
              <p className={styles.noTransactions}>No transactions to show.</p>
            ) : (
              <ul className={styles.list}>
                {transactions.map(tx => (
                  <li key={tx.id} className={styles.item}>
                    <Link
                      to={`/details?transaction_id=${tx.id}`}
                      className={styles.itemLink}
                    >
                      <span className={`${styles.status} ${styles[tx.status]}`} />
                      <span className={styles.date}>
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                      <span className={styles.contractor}>
                        {tx.to_account}
                      </span>
                      <span className={styles.amount}>
                        -${tx.amount.toFixed(2)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
