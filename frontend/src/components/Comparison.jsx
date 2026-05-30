import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Clock, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Comparison() {
  // Speed challenge states
  const [challengeState, setChallengeState] = useState('idle'); // idle, traditional, traditional_done, ai_processing, ai_done
  const [timer, setTimer] = useState(0);
  const [activeTxIndex, setActiveTxIndex] = useState(0);
  const timerIntervalRef = useRef(null);

  // User input states for manual task
  const [manualDescription, setManualDescription] = useState('');
  const [manualType, setManualType] = useState('expense');
  const [manualAmount, setManualAmount] = useState('');
  const [manualCategory, setManualCategory] = useState('');

  // Results tracking
  const [tradTime, setTradTime] = useState(0);
  const [tradErrors, setTradErrors] = useState(0);
  const [aiTime, setAiTime] = useState(1.2); // Static mock AI process time

  const challengeTxList = [
    { desc: "Server node deployment on AWS", amount: "49.00", correctCat: "Software & Subscriptions", correctType: "expense" },
    { desc: "Starbucks client coffee catchup", amount: "12.50", correctCat: "Meals & Entertainment", correctType: "expense" },
    { desc: "Payout received from contract Upwork", amount: "1500.00", correctCat: "Salary & Client Work", correctType: "income" }
  ];

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

  useEffect(() => {
    if (challengeState === 'traditional') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((t) => t + 0.1);
      }, 100);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [challengeState]);

  const startTraditionalChallenge = () => {
    setTimer(0);
    setActiveTxIndex(0);
    setTradErrors(0);
    setManualDescription('');
    setManualType('expense');
    setManualAmount('');
    setManualCategory('');
    setChallengeState('traditional');
  };

  const handleNextTraditional = (e) => {
    e.preventDefault();
    
    // Check accuracy
    const current = challengeTxList[activeTxIndex];
    let errors = 0;
    
    if (manualDescription.toLowerCase().strip ? manualDescription.toLowerCase().strip() !== current.desc.toLowerCase() : manualDescription.toLowerCase().trim() !== current.desc.toLowerCase()) {
      errors += 1;
    }
    if (parseFloat(manualAmount) !== parseFloat(current.amount)) {
      errors += 1;
    }
    if (manualCategory !== current.correctCat) {
      errors += 1;
    }
    if (manualType !== current.correctType) {
      errors += 1;
    }

    setTradErrors((errs) => errs + errors);

    if (activeTxIndex < challengeTxList.length - 1) {
      setActiveTxIndex((idx) => idx + 1);
      setManualDescription('');
      setManualAmount('');
      setManualCategory('');
      setManualType('expense');
    } else {
      setTradTime(timer);
      setChallengeState('traditional_done');
    }
  };

  const runAiChallenge = () => {
    setChallengeState('ai_processing');
    setTimeout(() => {
      setChallengeState('ai_done');
    }, 1200); // Simulated delay
  };

  const resetChallenge = () => {
    setChallengeState('idle');
    setTimer(0);
    setActiveTxIndex(0);
    setTradTime(0);
    setTradErrors(0);
  };

  const totalInputsCount = challengeTxList.length;
  const errorRate = ((tradErrors / (totalInputsCount * 4)) * 100).toFixed(0); // 4 inputs per tx
  const accuracyScore = 100 - parseInt(errorRate);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Visual Table Matrices */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>
          Traditional vs AI Comparison
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          A side-by-side comparison of manual ledger management vs autonomous AI categorization.
        </p>

        <div className="comparison-container">
          
          {/* Traditional Card */}
          <div className="compare-card traditional glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>
              📓 Traditional Bookkeeping
            </h3>
            
            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Processing Speed</span>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>15 mins/day (Manual)</span>
            </div>
            
            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Formulary Accuracy</span>
              <span style={{ fontWeight: '700', color: 'var(--warning)' }}>85-90% (Typing errors)</span>
            </div>

            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Overall Time Saved</span>
              <span style={{ fontWeight: '700', color: 'var(--text-tertiary)' }}>0 Hours (Baseline)</span>
            </div>

            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Human Effort</span>
              <span style={{ fontWeight: '700', color: 'var(--danger)' }}>High (Data entry, math audits)</span>
            </div>

            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Fraud Detection</span>
              <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Manual (Periodic Auditing)</span>
            </div>
          </div>

          {/* AI Card */}
          <div className="compare-card ai glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              <Sparkles size={20} /> AI Automated Bookkeeping
            </h3>
            
            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Processing Speed</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>Instant (~2 seconds)</span>
            </div>
            
            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Formulary Accuracy</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>98%+ (Verified Models)</span>
            </div>

            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Overall Time Saved</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>Saves 5+ Hours/Week</span>
            </div>

            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Human Effort</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>Minimal (Click to approve)</span>
            </div>

            <div className="comparison-metric">
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Fraud Detection</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>Automated (Real-time checks)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Speed Challenge Game */}
      <div className="glass-card" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <h3 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⏱️ Speed & Accuracy Simulation Challenge
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Experience the friction of traditional entry. Try to log 3 incoming transactions as fast as possible, then watch the AI automate it in a single click.
        </p>

        {challengeState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏁</span>
            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Are you ready to race?</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
              We will measure your manual input speed and categorization accuracy across 3 test entries.
            </p>
            <button className="btn btn-primary" onClick={startTraditionalChallenge}>
              <Play size={16} /> Start Traditional Run
            </button>
          </div>
        )}

        {challengeState === 'traditional' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Timer and Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>RUNNING TIMER</span>
                <h4 style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: '800', color: 'var(--warning)' }}>
                  {timer.toFixed(1)}s
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>TRANSACTION PROGRESS</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                  {activeTxIndex + 1} of {challengeTxList.length}
                </h4>
              </div>
            </div>

            {/* Prompt clue card */}
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)30' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                Receipt to Transcribe
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0.25rem 0' }}>
                "{challengeTxList[activeTxIndex].desc}"
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                <span>Amount: <strong>${challengeTxList[activeTxIndex].amount}</strong></span>
                <span>Category expectation: <strong>{challengeTxList[activeTxIndex].correctCat}</strong></span>
                <span>Type: <strong>{challengeTxList[activeTxIndex].correctType}</strong></span>
              </div>
            </div>

            {/* Entry fields for user */}
            <form onSubmit={handleNextTraditional} className="glass-card" style={{ padding: '1.25rem' }}>
              <div className="form-group">
                <label>Type Description Exactly</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder={challengeTxList[activeTxIndex].desc}
                  required 
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.5rem' }}>
                <div className="form-group">
                  <label>Type Amount Exactly</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Select Type</label>
                  <select 
                    className="form-control" 
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value)}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Select Category</label>
                <select 
                  className="form-control" 
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  required
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {activeTxIndex === challengeTxList.length - 1 ? 'Save & Complete Run' : 'Save & Next Transaction'}
              </button>
            </form>
          </div>
        )}

        {challengeState === 'traditional_done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center', gap: '1.25rem' }}>
            <span style={{ fontSize: '3rem' }}>✓</span>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Traditional Manual Run Completed!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Your Score: Took <strong>{tradTime.toFixed(1)} seconds</strong> with <strong>{tradErrors} typing/selection errors</strong>.
              </p>
            </div>
            
            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }}></div>
            
            <div>
              <h5 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Now, run the AI Automated engine on the exact same records:</h5>
              <button className="btn btn-primary" onClick={runAiChallenge} style={{ gap: '0.5rem' }}>
                <Sparkles size={16} /> Auto-Process All via AI
              </button>
            </div>
          </div>
        )}

        {challengeState === 'ai_processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--accent-primary)', borderWidth: '4px' }}></div>
            <h4 style={{ fontWeight: '700' }}>AI parsing receipt headers...</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Extracting parameters, checking database duplicates, running tax category class checks...
            </p>
          </div>
        )}

        {challengeState === 'ai_done' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Scorecard comparison dashboard */}
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              
              <div className="glass-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Traditional Method
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Manual Input Results</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Input Duration:</span>
                    <span style={{ fontWeight: '700', color: 'var(--warning)' }}>{tradTime.toFixed(1)}s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Typing Errors:</span>
                    <span style={{ fontWeight: '700', color: tradErrors > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {tradErrors} errors
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Accuracy Rating:</span>
                    <span style={{ fontWeight: '700', color: accuracyScore >= 90 ? 'var(--success)' : accuracyScore >= 70 ? 'var(--warning)' : 'var(--danger)' }}>
                      {accuracyScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)' 
              }}>
                <span className="badge badge-ai" style={{ marginBottom: '0.5rem' }}>
                  AI Automation
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Smart Extraction Results</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Processing Duration:</span>
                    <span style={{ fontWeight: '700', color: 'var(--success)' }}>{aiTime.toFixed(1)}s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Typing Errors:</span>
                    <span style={{ fontWeight: '700', color: 'var(--success)' }}>0 errors</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Accuracy Rating:</span>
                    <span style={{ fontWeight: '700', color: 'var(--success)' }}>100%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Victory statistics call-out */}
            <div style={{ 
              backgroundColor: 'var(--success-bg)', 
              color: 'var(--success)', 
              padding: '1.5rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={36} />
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.15rem' }}>
                  AI processed the ledger {((tradTime) / aiTime).toFixed(1)}x faster!
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Automation eliminated human typing errors and saved {(((tradTime - aiTime) / tradTime) * 100).toFixed(0)}% of formatting effort.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={resetChallenge} style={{ gap: '0.5rem' }}>
                <RefreshCw size={14} /> Try Another Speed Run
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
