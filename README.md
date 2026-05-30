# Traditional vs AI Bookkeeping Simulator

This is a beginner-friendly, visually premium educational web application designed to demonstrate the difference between manual spreadsheet bookkeeping and AI-driven automation. 

The application consists of a **Flask web server backend** (backed by SQLite database) and a **React frontend** styled with vanilla CSS custom properties (supporting light and dark mode toggling).

---

## Folder Structure

```
/project
  ├── backend/
  │    ├── app.py                # Flask main server (database models, API endpoints, AI classification rules)
  │    ├── database.db           # SQLite database file (created automatically on startup)
  │    └── requirements.txt      # Python requirements
  └── frontend/
       ├── package.json          # npm dependencies
       ├── vite.config.js        # Vite config with API proxy definitions
       ├── index.html            # Main site frame
       └── src/
            ├── main.jsx         # App entry point
            ├── index.css        # Rich dark/light custom theme stylesheet
            ├── App.jsx          # Top-level coordinator and local page router
            └── components/
                 ├── Dashboard.jsx            # Stats counter & summary card navigation
                 ├── TraditionalBookkeeping.jsx # Manual ledger tables and "Check-Your-Math" game
                 ├── AIBookkeeping.jsx         # Text parsing inputs, SVG charts, active fraud & insights
                 ├── Comparison.jsx           # side-by-side matrices & speed run challenge
                 └── Navbar.jsx               # header menu & sun/moon dark toggle
```

---

## Installation & Running Locally

Follow these instructions to run the backend database server and the React developer server concurrently:

### 1. Start the Flask Backend

Open a terminal window and run:

```bash
# Navigate to the backend directory
cd backend

# (Optional) Create a virtual environment
python -m venv venv
# Activate virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install the Python dependencies
pip install -r requirements.txt

# Start the Flask development server
python app.py
```

The Flask server will start listening at `http://127.0.0.1:8000`. It will automatically initialize the database file (`database.db`) and seed it with mock ledger records.

### 2. Start the React Frontend

Open a **separate** terminal window and run:

```bash
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start the Vite developer server
npm run dev
```

The Vite dev server will start at `http://localhost:3000`. Open this address in your web browser. 
Vite is pre-configured to proxy request routes starting with `/api` directly to your local Flask backend at `http://127.0.0.1:8000/api`.

---

## Core Features & AI Configuration

1. **Homepage Dashboard:** See total earnings/costs calculated separately for both traditional manual records and AI records. Check the amount of human work time saved by automation.
2. **Traditional Bookkeeping:** Select categories and flow types manually. Click **"Compile Ledger"** to trigger calculated totals. Play the **"Spreadsheet Accuracy Game"** by inputting your manual balance estimate to test for human calculation errors.
3. **AI Automated Bookkeeping:** Write simple natural descriptions (e.g. *"Starbucks client coffee for $12"*) and click classify. The backend will parse the details and add the record. See interactive SVG progress bars mapping expense categories and watch real-time fraud alerts flag double charges or suspicious amounts.
4. **Comparison Speed Run:** Play the **"Speed Challenge"**! Time your manual input speed against the AI's instant processing of 3 transactions and check your accuracy results.

### Optional Gemini Integration

By default, the AI classifier uses a robust **local pattern matching keyword engine** which works immediately without any api configuration.

To enable advanced generative intelligence:
1. Obtain an API key from Google AI Studio.
2. Open the `.env` file in the `backend` folder (or create one).
3. Set the key: `GEMINI_API_KEY=your_actual_key_here`.
4. Restart the Flask app. The server will automatically route categorization queries through **Gemini 1.5 Flash** to extract context parameters, generate customized financial advice, and audit fraud risks.
