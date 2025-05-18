import React, { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../styles/TransactionForm.module.css';

interface Props {
  onSuccess?: () => void;
}

const TransactionForm: React.FC<Props> = ({ onSuccess }) => {
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');      
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = parseFloat(amount);
    if (!fromAccount || !toAccount) {
      setError('Please fill in all fields correctly.');
      return;
    }
    if (fromAccount === toAccount) {
      setError('From and To accounts cannot be the same.');
      return;
    }
    if (isNaN(parsed)) {
      setError('Please enter a valid number for amount.');
      return;
    }
    if (parsed <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setError(null);
    try {
      await fetch('http://localhost:8000/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          from_account: fromAccount,
          to_account: toAccount,
          amount: parsed,
        }),
      });
      setFromAccount('');
      setToAccount('');
      setAmount('');     
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError('Failed to create transaction.');
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <h2>Make a transfer</h2>
      </div>
      <form onSubmit={handleCreate} className={styles.form}>
        <label>FROM ACCOUNT</label>
        <input
          value={fromAccount}
          onChange={e => setFromAccount(e.target.value)}
          required
        />

        <label>TO ACCOUNT</label>
        <input
          value={toAccount}
          onChange={e => setToAccount(e.target.value)}
          required
        />

        <label>AMOUNT</label>
        <input
          type="number"
          value={amount}
          onChange={e => {
            const cleaned = e.target.value.replace(/[^0-9.]/g, '');
            setAmount(cleaned);
          }}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
