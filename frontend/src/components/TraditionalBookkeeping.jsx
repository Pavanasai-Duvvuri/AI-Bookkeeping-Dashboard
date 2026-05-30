import React, { useState } from 'react';
import { PlusCircle, Calculator, Check, AlertCircle, Trash2 } from 'lucide-react';

export default function TraditionalBookkeeping({ transactions, addTransaction, deleteTransaction }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General Expense');
  
  // Traditional calculations are hidden until manually clicked
  const [manualCalculated, setManualCalculated] = useState(false);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [calculating, setCalculating] = useState(false);

  // Math test state
  const [userMathGuess, setUserMathGuess] = useState('');
  const [mathResult, setMathResult] = useState(null);

  const categories = [
    'Meals & Entertainment',
    'Travel & Transport',
    'Software & Subscriptions',
    'Rent & Facilities',
    'Office Equipment',
    'Salary & Client Work',
    'Utilities',
    'Marketing & Ads',
    'General Expense'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    await addTransaction({
      date,
      description: description.trim(),
      type,
      amount: parseFloat(amount),
      category,
      is_ai: 0 // 0 means Traditional
    });

    // Reset inputs
    setDescription('');
    setAmount('');
    // In traditional, adding a transaction invalidates the calculated total!
    setManualCalculated(false);
    setMathResult(null);
    setUserMathGuess('');
  };

  const handleCalculate = () => {
    setCalculating(true);
    setManualCalculated(false);
    setTimeout(() => {
      let income = 0;
      let expense = 0;
      transactions.forEach((tx) => {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expense += tx.amount;
        }
      });
      setTotals({
        income,
        expense,
        balance: income - expense
      });
      setCalculating(false);
      setManualCalculated(true);
    }, 800); // Artificial delay to simulate human compilation/spreadsheet loading
  };

  const handleVerifyMath = () => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });
    const actualBalance = income - expense;
    const guessNum = parseFloat(userMathGuess);

    if (isNaN(guessNum)) {
      setMathResult({ status: 'error', message: 'Please enter a valid numeric value.' });
      return;
    }

    if (Math.abs(guessNum - actualBalance) < 0.01) {
      setMathResult({ 
        status: 'success', 
        message: `Perfect match! The ledger balance is indeed ${formatCurrency(actualBalance)}. Double-entry complete.`
      });
    } else {
      const difference = Math.abs(guessNum - actualBalance);
      setMathResult({ 
        status: 'fail', 
        message: `Discrepancy found! Your calculation is off by ${formatCurrency(difference)}. Traditional typing and arithmetic slip-ups affect 10-15% of manual spreadsheets.`
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="animate-fade-in grid-2">
      
      {/* Entry Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Input Card */}
        <div className="glass-card">
          <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✍️ Manual Ledger Entry
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Transaction Description</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Target Office supplies" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.25rem' }}>
              <div className="form-group">
                <label>Flow Type</label>
                <select 
                  className="form-control" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense (-)</option>
                  <option value="income">Income (+)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tax Category Class</label>
              <select 
                className="form-control" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <PlusCircle size={16} /> Log Entry to Ledger
            </button>
          </form>
        </div>

        {/* Manual Totals Card */}
        <div className="glass-card">
          <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧮 Manual Balance Calculation
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            In traditional systems, balances do not automatically update. You must manually sum all values.
          </p>

          {!manualCalculated && !calculating && (
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleCalculate}>
              <Calculator size={16} /> Compile Ledger & Run Calculations
            </button>
          )}

          {calculating && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <div className="spinner" style={{ borderTopColor: 'var(--accent-primary)' }}></div>
                <span>Compiling formulas and cell ranges...</span>
              </div>
            </div>
          )}

          {manualCalculated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Manual Income Total:</span>
                <span style={{ fontWeight: '700', color: 'var(--success)' }}>{formatCurrency(totals.income)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Manual Expense Total:</span>
                <span style={{ fontWeight: '700', color: 'var(--danger)' }}>{formatCurrency(totals.expense)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                <span style={{ fontWeight: '700' }}>Calculated Net Balance:</span>
                <span style={{ fontWeight: '800', color: totals.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatCurrency(totals.balance)}
                </span>
              </div>
              <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem' }} onClick={() => setManualCalculated(false)}>
                Recalculate
              </button>
            </div>
          )}
        </div>

        {/* Practice balancing game */}
        <div className="glass-card">
          <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧠 Test Your Spreadsheet Accuracy
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Try adding up the transactions in the table. Enter your calculated Net Balance below:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. 1250.50" 
              value={userMathGuess}
              onChange={(e) => setUserMathGuess(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            />
            <button className="btn btn-secondary" onClick={handleVerifyMath} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', flexShrink: 0 }}>
              Verify
            </button>
          </div>

          {mathResult && (
            <div style={{ 
              marginTop: '0.75rem', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              backgroundColor: mathResult.status === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: mathResult.status === 'success' ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${mathResult.status === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
            }}>
              {mathResult.status === 'success' ? <Check size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
              <span>{mathResult.message}</span>
            </div>
          )}
        </div>

      </div>

      {/* Ledger Table Panel */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflow: 'hidden' }}>
        <div>
          <h3 style={{ fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📓 Traditional Ledger Book
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            This list represents your raw notebook database entries. Entries here have no AI categorization attributes.
          </p>
        </div>

        <div className="table-container" style={{ flexGrow: 1, minHeight: '350px', maxHeight: '550px', overflowY: 'auto' }}>
          {transactions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-tertiary)' }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📓</span>
              <p style={{ fontWeight: '600' }}>No manual transactions logged.</p>
              <p style={{ fontSize: '0.8rem' }}>Use the entry form to add records.</p>
            </div>
          ) : (
            <table className="table-ledger">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{tx.date}</td>
                    <td style={{ fontWeight: '600' }}>{tx.description}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{tx.category}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${tx.type}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', fontFamily: 'monospace' }}>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-icon-only" 
                        onClick={() => deleteTransaction(tx.id)}
                        title="Delete entry"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <span>Total Transactions: {transactions.length}</span>
          <span>⚠️ Calculations out of sync. Please click "Compile Ledger" to recalculate.</span>
        </div>
      </div>

    </div>
  );
}
