import React, { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [aiResult, setAiResult] = useState(null);

  const API = "https://ai-bookkeeping-dashboard.onrender.com";

  const fetchTransactions = async () => {
    const res = await fetch(`${API}/transactions`);
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    if (amount === "") return;

    await fetch(`${API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Number(amount) }),
    });

    setAmount("");
    fetchTransactions();
  };

  const clearTransactions = async () => {
    await fetch(`${API}/transactions/clear`, {
      method: "DELETE",
    });

    setAiResult(null);
    fetchTransactions();
  };

  const launchAI = async () => {
    const res = await fetch(`${API}/ai/analyze`, {
      method: "POST",
    });

    const data = await res.json();
    setAiResult(data);
  };

  const getRiskColor = () => {
    if (!aiResult) return "#64748b";
    if (aiResult.risk_level === "SAFE") return "#16a34a";
    if (aiResult.risk_level === "WARNING") return "#f59e0b";
    return "#dc2626";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <div
          style={{
            background: "#0f172a",
            color: "white",
            padding: "30px",
            borderRadius: "18px",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ margin: 0 }}>AI Bookkeeping Dashboard</h1>
          <p style={{ color: "#cbd5e1" }}>
            Traditional Ledger + AI Fraud Detection + SQLite Database
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2>Manual Ledger</h2>

            <input
              type="number"
              placeholder="Enter transaction amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: "12px",
                width: "60%",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                marginRight: "10px",
              }}
            />

            <button
              onClick={addTransaction}
              style={{
                padding: "12px 16px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Add
            </button>

            <button
              onClick={clearTransactions}
              style={{
                padding: "12px 16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            <div style={{ marginTop: "20px" }}>
              {transactions.length === 0 ? (
                <p>No transactions added yet.</p>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: "#eff6ff",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{t.amount}
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2>AI Analysis</h2>

            <button
              onClick={launchAI}
              style={{
                padding: "12px 22px",
                background: "#020617",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Launch AI Engine
            </button>

            {aiResult && (
              <div style={{ marginTop: "25px" }}>
                <span
                  style={{
                    background: getRiskColor(),
                    color: "white",
                    padding: "10px 18px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {aiResult.risk_level}
                </span>

                <div
                  style={{
                    marginTop: "15px",
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "10px",
                  }}
                >
                  <p>
                    <b>Status:</b> {aiResult.status}
                  </p>
                  <p>
                    <b>Risk Score:</b> {aiResult.risk_score}
                  </p>
                  <p>
                    <b>Message:</b> {aiResult.message}
                  </p>
                  <p>
                    <b>Total Transactions:</b> {aiResult.total_transactions}
                  </p>
                  <p>
                    <b>Highest Amount:</b> ₹{aiResult.highest_amount}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginTop: "25px",
          }}
        >
          <h2>Traditional vs AI Bookkeeping</h2>
          <p>
            This comparison shows how AI improves bookkeeping speed, accuracy,
            fraud detection, and data storage.
          </p>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr style={{ background: "#2563eb", color: "white" }}>
                <th style={{ padding: "12px" }}>Feature</th>
                <th style={{ padding: "12px" }}>Traditional Bookkeeping</th>
                <th style={{ padding: "12px" }}>AI Bookkeeping</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["Speed", "Manual and slower", "Automatic and faster"],
                ["Accuracy", "Human errors possible", "Higher consistency"],
                ["Fraud Detection", "Manual checking", "Automatic alerts"],
                ["Data Storage", "Paper/manual records", "SQLite database storage"],
                ["Insights", "Limited", "Risk score and analysis"],
                ["Human Effort", "High effort required", "Reduced effort"],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                    {row[0]}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                    {row[1]}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#64748b" }}>
          Developed by Pavan Sai | B.E. CSE (AI & DS)
        </p>
      </div>
    </div>
  );
}

export default App;