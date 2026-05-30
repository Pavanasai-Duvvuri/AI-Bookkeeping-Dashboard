import React from 'react';
import { LayoutDashboard, Receipt, Cpu, ArrowLeftRight, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'traditional', label: 'Traditional Ledger', icon: Receipt },
    { id: 'ai', label: 'AI Automated', icon: Cpu },
    { id: 'comparison', label: 'Compare & Challenge', icon: ArrowLeftRight },
  ];

  return (
    <nav className="glass-card" style={{ 
      borderRadius: 'var(--radius-lg)', 
      marginBottom: '2rem', 
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
        <span style={{ fontSize: '1.75rem' }}>📊</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            SmartBook
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
            Traditional vs AI
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.25rem',
        backgroundColor: 'var(--bg-tertiary)',
        padding: '0.25rem',
        borderRadius: '50px',
        flexWrap: 'wrap'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '50px',
                backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.03)' : 'none'
              }}
            >
              <Icon size={16} />
              <span className="nav-label" style={{ display: 'inline' }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={toggleTheme}
          className="btn-icon-only"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--warning)' }} /> : <Moon size={18} style={{ color: 'var(--text-secondary)' }} />}
        </button>
      </div>
    </nav>
  );
}
