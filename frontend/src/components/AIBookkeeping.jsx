import React, { useState } from 'react';
import { Sparkles, HelpCircle, ShieldAlert, TrendingDown, Trash2, Check, AlertCircle } from 'lucide-react';

export default function AIBookkeeping({ transactions, addTransaction, deleteTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Group transaction categories for SVG rendering
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expenseByCategory = {};
  expenses.forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });

  const categoryList = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  const fraudAlerts = transactions.filter(t => t.fraud_flag === 1);
  const insights = transactions.filter(t => t.is_ai === 1 && t.insight).slice(0, 4);

  // Quick prompt presets for beginners to click and see immediate AI extraction
  const presets = [
    { text: "Monthly salary from Acme Corp", amount: "4000.00", icon: "💼" },
    { text: "Server hosting payment to AWS", amount: "45.99", icon: "🌐" },
    { text: "Business lunch with client at McDonald's", amount: "32.50", icon: "🍔" },
    { text: "Suspected unknown card charge", amount: "120.00", icon: "⚠️" },
    { text: "Bought ergonomic office chair", amount: "250.00", icon: "🪑" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    setProcessing(true);
    setFeedback(null);

    try {
      const response = await addTransaction({
        date,
        description: description.strip ? description.strip() : description.trim(),
        amount: parseFloat(amount),
        is_ai: 1 // 1 means AI Bookkeeping
      });

      if (response) {
        setFeedback({
          status: 'success',
          category: response.category,
          type: response.type,
          confidence: response.confidence,
          insight: response.insight,
          fraud: response.fraud_flag === 1 ? response.fraud_reason : null
        });
        setDescription('');
        setAmount('');
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        status: 'error',
        message: 'AI model extraction failed. Check connection.'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setDescription(preset.text);
    setAmount(preset.amount);
    setFeedback(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Color mapper for categories
  const getCategoryColor = (cat) => {
    const colors = {
      'Meals & Entertainment': '#ec4899', // Pink
      'Travel & Transport': '#f59e0b', // Yellow
      'Software & Subscriptions': '#6366f1', // Indigo
      'Rent & Facilities': '#3b82f6', // Blue
      'Office Equipment': '#10b981', // Emerald
      'Salary & Client Work': '#10b981',
      'Utilities': '#06b6d4', // Cyan
      'Marketing & Ads': '#8b5cf6', // Purple
      'General Expense': '#64748b' // Slate
    };
    return colors[cat] || '#94a3b8';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dynamic Security alerts */}
      {fraudAlerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {fraudAlerts.slice(0, 2).map((alert) => (
            <div key={alert.id} className="alert-banner animate-pulse-glow" style={{ margin: '0' }}>
              <ShieldAlert size={22} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  AI Fraud Engine Warning
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Flagged <strong>"{alert.description}"</strong>: {alert.fraud_reason}
                </p>
              </div>
              <span className="badge" style={{ backgroundColor: 'var(--danger)', color: 'white', fontSize: '0.65rem' }}>
                High Risk
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid-2">
        
        {/* AI Entry Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
              <Sparkles size={18} /> AI Transaction Auto-Extraction
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Type your description and amount. The system will categorize, check fraud, and generate tip insights.
            </p>

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
                <textarea 
                  className="form-control" 
                  rows="2"
                  placeholder="e.g. Starbucks coffee yesterday or Payout from freelance Upwork contract..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                />
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

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', gap: '0.75rem' }}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="spinner"></div>
                    <span>AI Model Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Auto-Categorize & Log Entry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick presets helper */}
          <div className="glass-card">
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              💡 Quick Practice Presets
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.825rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{preset.icon}</span>
                    <span>{preset.text}</span>
                  </span>
                  <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>${preset.amount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Extraction Results Feedback */}
          {feedback && (
            <div className="glass-card animate-fade-in" style={{ 
              border: `1px solid ${feedback.status === 'success' ? 'var(--success)' : 'var(--danger)'}`,
              background: feedback.status === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)' 
            }}>
              {feedback.status === 'success' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} style={{ color: 'var(--success)' }} /> AI Extraction Successful!
                  </h4>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-ai">
                      Category: {feedback.category}
                    </span>
                    <span className={`badge badge-${feedback.type}`}>
                      Type: {feedback.type}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      Confidence: {feedback.confidence}%
                    </span>
                  </div>

                  {feedback.insight && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '0.5rem' }}>
                      "{feedback.insight}"
                    </p>
                  )}

                  {feedback.fraud && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '600' }}>
                      <ShieldAlert size={14} /> Security Flag: {feedback.fraud}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                  <AlertCircle size={18} />
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* AI Reports & Visual charts panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem' }}>
              📊 Interactive Spending Analysis
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Dynamic charts mapping your database transactions. Updates instantly upon every submission.
            </p>
          </div>

          {/* SVG spending bars representation (Replaces complex canvas/libraries) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Expense Allocation by Category
            </h4>
            
            {categoryList.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                <TrendingDown size={28} style={{ marginBottom: '0.5rem' }} />
                <span>No expense data logged to display charts.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categoryList.map(([cat, val]) => {
                  const pct = totalExpense > 0 ? (val / totalExpense) * 100 : 0;
                  return (
                    <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <span style={{ fontWeight: '600' }}>{cat}</span>
                        <span>
                          <strong>{formatCurrency(val)}</strong> ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      
                      {/* Modern responsive progress bar line */}
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${pct}%`, 
                          height: '100%', 
                          backgroundColor: getCategoryColor(cat), 
                          borderRadius: '10px',
                          transition: 'width 0.5s ease-in-out'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Real-time Insights stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              AI Automated Financial Insights
            </h4>
            {insights.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                Insights will appear here once AI transactions are logged.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {insights.map((tx) => (
                  <div key={tx.id} style={{ 
                    backgroundColor: 'var(--bg-tertiary)', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.8rem',
                    borderLeft: `4px solid ${getCategoryColor(tx.category)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem'
                  }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{tx.description}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{tx.insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* AI Ledger Book Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚡ AI Auto-Categorized Ledger
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Ledger database transactions generated by the AI classifier engine.
            </p>
          </div>
          <span className="badge badge-ai" style={{ padding: '0.5rem 0.75rem' }}>
            Scan Active: {transactions.length} Records
          </span>
        </div>

        <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {transactions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-tertiary)' }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</span>
              <p style={{ fontWeight: '600' }}>No AI transactions logged.</p>
              <p style={{ fontSize: '0.8rem' }}>Write details in the form to test extraction.</p>
            </div>
          ) : (
            <table className="table-ledger">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Tax Category</th>
                  <th>Confidence</th>
                  <th>Flow</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'center' }}>Security</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ 
                    borderLeft: tx.fraud_flag === 1 ? '3px solid var(--danger)' : 'none',
                    backgroundColor: tx.fraud_flag === 1 ? 'var(--danger-bg)' : 'transparent'
                  }}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{tx.date}</td>
                    <td style={{ fontWeight: '600' }}>
                      {tx.description}
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: `${getCategoryColor(tx.category)}15`, color: getCategoryColor(tx.category), border: `1px solid ${getCategoryColor(tx.category)}25` }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>
                      <span style={{ color: tx.confidence >= 95 ? 'var(--success)' : 'var(--warning)' }}>
                        {tx.confidence ? `${tx.confidence}%` : 'N/A'}
                      </span>
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
                      {tx.fraud_flag === 1 ? (
                        <span className="badge" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.65rem' }} title={tx.fraud_reason}>
                          🚨 Suspicious
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.65rem' }}>
                          ✓ Safe
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-icon-only" 
                        onClick={() => deleteTransaction(tx.id)}
                        title="Delete record"
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
      </div>

    </div>
  );
}
