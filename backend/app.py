from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_NAME = "database.db"


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL
        )
    """)

    conn.commit()
    conn.close()


@app.route("/transactions", methods=["GET"])
def get_transactions():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT id, amount FROM transactions")
    rows = cursor.fetchall()

    conn.close()

    transactions = [{"id": row[0], "amount": row[1]} for row in rows]

    return jsonify(transactions)


@app.route("/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json()
    amount = data.get("amount")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO transactions (amount) VALUES (?)", (amount,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Transaction saved successfully"})


@app.route("/transactions/clear", methods=["DELETE"])
def clear_transactions():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM transactions")

    conn.commit()
    conn.close()

    return jsonify({"message": "All transactions cleared"})


@app.route("/ai/analyze", methods=["POST"])
def ai_analyze():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT amount FROM transactions")
    rows = cursor.fetchall()

    conn.close()

    transactions = [row[0] for row in rows]

    risk_score = 0.1
    risk_level = "SAFE"
    message = "All transactions look safe"

    if any(amount >= 50000 for amount in transactions):
        risk_score = 0.9
        risk_level = "HIGH RISK"
        message = "⚠ High value suspicious transaction detected"
    elif len(transactions) != len(set(transactions)):
        risk_score = 0.6
        risk_level = "WARNING"
        message = "⚠ Duplicate transactions found"

    return jsonify({
        "status": "AI Engine Active",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "message": message,
        "total_transactions": len(transactions),
        "highest_amount": max(transactions) if transactions else 0
    })


if __name__ == "__main__":
    init_db()
    app.run(port=5000, debug=True)