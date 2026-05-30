import React from 'react';
import { Play, TrendingUp, TrendingDown, Clock, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Dashboard({ stats, resetDatabase, setActiveTab }) {
  const trad = stats?.trad || { income: 0, expense: 0, balance: 0, count: 0, fraud_count: 0 };
  const ai = stats?.ai || { income: 0, expense: 0, balance: 0, count: 0, fraud_count: 0 };

  // Calculate estimated time spent
  // Traditional: 5 mins (300 secs) per transaction manual entry + formula calculations
  // AI: 2 seconds per transaction
  const tradTimeSecs = trad.count * 300;
  const aiTimeSecs = ai.count * 2;
  const timeSavedSecs = Math.max(0, tradTimeSecs - aiTimeSecs);

  const formatTime = (seconds) => {
    if (seconds === 0) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = '';
    if (hrs > 0) result += `${hrs}h `;
    if (mins > 0) result += `${mins}m `;
    if (secs > 0 || result === '') result += `${secs}s`;
    return result.strip ? result.strip() : result.trim();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '2.5rem'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 className="header-gradient" style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: '1.2' }}>
            Traditional vs AI Bookkeeping
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
            Experience the difference between manual spreadsheet formulas and smart, AI-driven automation. 
            Add transactions, generate real-time reports, and test your skills in the simulation challenge!
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('ai')}>
              <Zap size={16} /> Try AI Bookkeeping
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('comparison')}>
              Take the Speed Challenge
            </button>
          </div>
        </div>
        <div style={{ fontSize: '5rem', userSelect: 'none' }}>🤖</div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4">
        
        <div className="glass-card" style={{ position: 'relative' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
            Traditional Balance
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.5rem 0 0.25rem 0', color: 'var(--text-primary)' }}>
            {formatCurrency(trad.balance)}
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)' }}>
              <TrendingUp size={12} /> {formatCurrency(trad.income)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)' }}>
              <TrendingDown size={12} /> {formatCurrency(trad.expense)}
            </span>
          </div>
          <span className="badge" style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
            Manual
          </span>
        </div>

        <div className="glass-card" style={{ position: 'relative', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-secondary)' }}>
            AI Balance
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.5rem 0 0.25rem 0', color: 'var(--text-primary)' }}>
            {formatCurrency(ai.balance)}
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)' }}>
              <TrendingUp size={12} /> {formatCurrency(ai.income)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)' }}>
              <TrendingDown size={12} /> {formatCurrency(ai.expense)}
            </span>
          </div>
          <span className="badge badge-ai" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            AI Verified
          </span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
            Activity Counts
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.5rem 0 0.25rem 0', color: 'var(--text-primary)' }}>
            {trad.count + ai.count} Total
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Traditional: <strong>{trad.count}</strong> | AI: <strong>{ai.count}</strong>
          </p>
        </div>

        <div className="glass-card" style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)' 
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} /> Work Time Saved
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.5rem 0 0.25rem 0', color: 'var(--success)' }}>
            {formatTime(timeSavedSecs)}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Traditional: {formatTime(tradTimeSecs)} | AI: {formatTime(aiTimeSecs)}
          </p>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid-2">
        {/* Traditional vs AI Details */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📓 Traditional Ledger Method
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Traditional bookkeeping forces you to classify every entry by hand. You must search matching categories, double check receipt amounts, write database values, and manually run mathematical formulas.
          </p>
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Time Spent:</strong> Up to 5 minutes per receipt entry</li>
              <li><strong>Error Rates:</strong> 10-15% chance of entry typing errors</li>
              <li><strong>Data Integrity:</strong> Hard to spot duplicate transactions</li>
              <li><strong>Formulas:</strong> Broken Excel sheets and manual balancing</li>
            </ul>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={() => setActiveTab('traditional')}>
            Open Manual Ledger
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            ⚡ AI Autonomous Method
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            AI Bookkeeping automates classification. Paste or write a simple description, and the system extracts transaction parameters, assigns perfect tax category classes, runs safety checks, and plots reports automatically.
          </p>
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Time Spent:</strong> ~2 seconds per transaction</li>
              <li><strong>Error Rates:</strong> &lt;2% categorizations verified</li>
              <li><strong>Data Integrity:</strong> Automatic duplicate & fraud alerts</li>
              <li><strong>Formulas:</strong> Fully reactive dashboards and charts</li>
            </ul>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={() => setActiveTab('ai')}>
            Launch AI Engine
          </button>
        </div>
      </div>

      {/* Fraud alerts or notifications on Dashboard */}
      {ai.fraud_count > 0 && (
        <div className="alert-banner animate-pulse-glow" style={{ margin: '0' }}>
          <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Potential Ledger Vulnerabilities
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              The AI Safety scanner has flagged <strong>{ai.fraud_count}</strong> suspicious entry in your AI bookkeeping workspace. 
              Open the AI section to examine active warnings.
            </p>
          </div>
        </div>
      )}

      {/* Reset & Seeds Management */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem' }}>
        <div>
          <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Local SQLite Workspace Data</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            All ledger transactions are stored in a local SQLite file in your project directory.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={resetDatabase} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <RefreshCw size={14} /> Reset Database to Seeds
        </button>
      </div>

    </div>
  );
}
