# SocialGuard AI – Social Engineering Attack Detection & Risk Analysis System

> **“Detect. Understand. Stay Safe.”**  
> An AI-powered full-stack web application that analyzes suspicious messages and emails for social engineering risks, scores threat levels, extracts explainable deception indicators, and provides actionable safety countermeasures.

---

## 1. Project Overview

**SocialGuard AI** is a cybersecurity SaaS application built to defend individuals and organizations against sophisticated digital social engineering attacks, including:
- **Urgency Manipulation** (e.g., *"Act immediately"*, *"Account blocked today"*)
- **Fear & Intimidation Tactics** (e.g., *"Legal action initiated"*, *"Arrest warrant"*)
- **Credential & OTP Harvesting** (e.g., *"Send 6-digit OTP"*, *"Verify net banking password"*)
- **Financial Fraud Demands** (e.g., *"Wire money via Western Union"*, *"Buy Apple gift cards"*)
- **Authority & Executive Impersonation** (e.g., *"CEO urgent request"*, *"State Bank Security"*)
- **Fake Rewards & Prize Baits** (e.g., *"Lottery winner"*, *"Unclaimed $2.5M inheritance"*)
- **Account Verification Scams** (e.g., *"KYC expired"*, *"Unauthorized transaction alert"*)
- **Emotional Exploitation** (e.g., *"Grandson arrested in hospital"*, *"Keep this secret"*)
- **Suspicious Link Intelligence** (e.g., direct IP hosts, shortened URLs, punycode spoofing, and high-risk TLDs like `.xyz`, `.top`, `.online` parsed safely without live web execution)

> **Important Ethics Disclaimer**: In accordance with responsible cybersecurity design, SocialGuard AI categorizes attacks using probabilistic bands (**Low Risk**, **Suspicious**, **High Risk**, **Critical Risk**) and never asserts absolute 100% immunity.

---

## 2. Key Features

- **Multi-Modal Threat Scanners**:
  - **Suspicious Message Analyzer**: Large input workspace with character counting, instant preset benchmarks, clear controls, and responsive feedback.
  - **Phishing Email Analyzer**: Dedicated inspection of sender domains, subject lines, body text, and embedded hyperlinks.
- **Explainable Cybersecurity Reporting**:
  - **Dynamic Circular Risk Meter**: Calibrated 0–100 risk score gauge with risk classification badges.
  - **Identified Indicators**: Categorized deception tags with severity ratings (`Low`, `Medium`, `High`, `Critical`).
  - **Plain-English Rationale**: Clear reasoning answering *"Why is this suspicious?"*.
  - **Actionable Safety Checklist**: Practical defenses specific to the detected attack vectors.
  - **Safe URL Scanner**: Identifies lookalike domains and malicious structure without requesting untrusted links.
- **Personal Threat Dashboard**:
  - Metric summary cards (Total Scans, Low Risk, Suspicious, High/Critical Risk).
  - Risk distribution donut chart.
  - 7-day threat trend timeline.
  - Top detected social engineering indicator frequency graph.
  - Recent analysis table with click-to-view detailed modal.
- **Analysis History & Forensics**:
  - Filterable by Risk Level (`Low`, `Suspicious`, `High`, `Critical`) and Channel (`Message`, `Email`).
  - Full-text search across message content, subject, and sender headers.
  - View full report modal, delete individual records, and clear complete history.
- **Cybersecurity Education Hub**:
  - 7 categorised safety guides (Message Safety, Email Safety, Password Safety, OTP Confidentiality, Link Verification, Social Media Protection, Online Shopping Defense) complete with red flag warnings and defense checklists.
- **Role-Based Administration Console**:
  - Overview of global scan volume, threat distributions, system health, and registered user directory.
- **Security & Modern UI**:
  - Dark Mode and Light Mode with persistence and instant toggle.
  - PBKDF2/SHA-256 password hashing with Werkzeug.
  - JWT token authentication with expiration enforcement.
  - Input length validation and XSS-safe text rendering.

---

## 3. Technology Stack

### Frontend
- **React 19**
- **Tailwind CSS v4**
- **Lucide React** (cybersecurity icon set)
- **Vite 8** (lightning-fast build system & development proxy)

### Backend
- **Python 3.14+**
- **Flask REST API**
- **Flask-CORS** (cross-origin resource sharing)
- **PyJWT** (JSON Web Tokens)
- **Werkzeug** (cryptographic password hashing)
- **SQLAlchemy 2.0** (ORM and connection pooling)
- **PyMySQL & Cryptography** (MySQL connectivity)

### Machine Learning & NLP
- **Scikit-Learn**
- **TF-IDF Vectorizer** (1–2 n-grams, sublinear term frequency)
- **Logistic Regression Classifier** (balanced class weighting)
- **Safe Regex URL & Entity Parser**

### Database
- **Primary**: MySQL (`socialguard_db`) via `schema.sql`
- **Zero-Configuration Fallback**: Automatic local SQLite (`socialguard.db`) if MySQL is offline.

---

## 4. Project Structure

```
SocialGuardAI/
├── backend/
│   ├── app.py                     # Flask entry point, error handlers, and CORS
│   ├── config.py                  # Configuration & environment variable parser
│   ├── database.py                # Database connection & auto-fallback manager
│   ├── models.py                  # SQLAlchemy models (User, Analysis, Indicator, Recommendation)
│   ├── schema.sql                 # MySQL schema script with foreign keys & indexes
│   ├── seed.py                    # Seeder for demo accounts & realistic analyses
│   ├── requirements.txt           # Python backend dependencies
│   ├── middleware/
│   │   └── auth_middleware.py     # JWT token generator, @token_required, @admin_required
│   ├── routes/
│   │   ├── auth_routes.py         # /api/auth (register, login, me, forgot)
│   │   ├── analyze_routes.py      # /api/analyze (message & email analysis)
│   │   ├── history_routes.py      # /api/history (search, filter, view, delete)
│   │   ├── dashboard_routes.py    # /api/dashboard/stats, /api/admin/stats
│   │   ├── profile_routes.py      # /api/profile (view, edit, password)
│   │   └── safety_routes.py       # /api/safety-tips (educational guidelines)
│   ├── services/
│   │   ├── analysis_service.py    # Multi-layered heuristic + ML analysis engine
│   │   └── url_analyzer.py        # Safe URL pattern analyzer (no untrusted visits)
│   ├── ml/
│   │   ├── dataset.csv            # Labeled training dataset
│   │   ├── preprocess.py          # NLP tokenization & text sanitization
│   │   ├── train_model.py         # TF-IDF + Classifier training pipeline
│   │   ├── predict.py             # Model inference & calibrated probability score
│   │   ├── model.pkl              # Serialized trained classifier
│   │   └── vectorizer.pkl         # Serialized TF-IDF vectorizer
│   └── tests/
│       ├── test_auth.py           # Authentication, validation, and JWT tests
│       ├── test_analyze.py        # Attack detection, indicators, and scoring tests
│       └── test_ml.py             # Preprocessor, URL analyzer, and ML tests
├── frontend/
│   ├── package.json
│   ├── vite.config.js             # Vite + Tailwind plugin + /api proxy
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                # Application root with navigation router
│       ├── index.css              # Tailwind v4 styles & cybersecurity accents
│       ├── api/client.js          # API client wrapper with JWT injection
│       ├── context/
│       │   ├── AuthContext.jsx    # Authentication state & user session
│       │   └── ThemeContext.jsx   # Dark/Light mode theme state & persistence
│       ├── components/
│       │   ├── Navbar.jsx         # Header navbar, active states, mobile menu
│       │   ├── Footer.jsx         # Footer with safety advisory & quick links
│       │   ├── RiskMeter.jsx      # Animated SVG circular risk gauge
│       │   ├── IndicatorBadge.jsx # Indicator badges with icons & severity
│       │   ├── ResultCard.jsx     # Comprehensive cybersecurity report view
│       │   ├── Charts.jsx         # Donut, Timeline trend, and Bar charts
│       │   ├── Toast.jsx          # Notification toasts
│       │   ├── Modal.jsx          # Reusable accessible dialog
│       │   └── ProtectedRoute.jsx # Guard for logged-in and admin pages
│       └── pages/
│           ├── LandingPage.jsx    # Hero, interactive preview, features, CTA
│           ├── LoginPage.jsx      # Login form with demo quick-fill
│           ├── RegisterPage.jsx   # Account creation with validation
│           ├── DashboardPage.jsx  # User metrics, 3 charts, recent table
│           ├── MessageAnalyzerPage.jsx # Message analyzer with presets
│           ├── EmailAnalyzerPage.jsx   # Email analyzer with link scanner
│           ├── HistoryPage.jsx    # Filterable & searchable scan history
│           ├── SafetyTipsPage.jsx # 7 educational defense categories
│           ├── ProfilePage.jsx    # Profile management & password change
│           └── AdminDashboardPage.jsx # Admin SOC console & user list
├── .env.example                   # Environment configuration template
├── .env                           # Local active configuration
└── README.md                      # Comprehensive documentation
```

---

## 5. Quick Start & Installation

### Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** & **npm**

### Step 1: Clone or Navigate to Directory
```bash
cd c:/Users/HP/Desktop/SocialGuardAI
```

### Step 2: Install Backend Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### Step 3: Initialize & Seed Database
```bash
python -m backend.seed
```
*This initializes the database schema (MySQL or local SQLite fallback) and creates default demo accounts and realistic sample records.*

### Step 4: Train / Retrain ML Model (Optional)
```bash
python -m backend.ml.train_model
```
*Trains the TF-IDF vectorizer and Logistic Regression classifier on `backend/ml/dataset.csv` and outputs `model.pkl` and `vectorizer.pkl`.*

### Step 5: Install Frontend Dependencies
```bash
cd frontend
npm.cmd install
cd ..
```

---

## 6. Running the Application

### Start the Backend (Port 5000)
In your terminal, run:
```bash
python -m backend.app
```
*The Flask REST API will start at `http://127.0.0.1:5000`.*

### Start the Frontend (Port 5173)
In a second terminal window, run:
```bash
cd frontend
npm.cmd run dev
```
*The Vite development server will start at `http://localhost:5173`.*

Open your browser and visit:  
👉 **`http://localhost:5173`**

---

## 7. Demo Accounts & Credentials

For instant testing and evaluation, the database comes pre-seeded with two accounts:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Standard User** | `user@socialguard.ai` | `User@123` | Message & Email Analyzer, Threat Dashboard, Scan History, Profile |
| **Security Administrator** | `admin@socialguard.ai` | `Admin@123` | Full User Access + Admin SOC Console, Global Charts, User Directory |

*(Quick-fill buttons for both accounts are also built directly into the Login page!)*

---

## 8. Database Setup

### Option A: Automatic SQLite (Default Out-of-the-Box)
No database server setup required. When `DB_TYPE=auto` or `DB_TYPE=sqlite`, SocialGuard AI automatically maintains `backend/socialguard.db`.

### Option B: MySQL (Production / Standard)
1. Ensure MySQL Server is running on port 3306 (e.g. via MySQL Workbench, XAMPP, or service).
2. Import the schema:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
3. Configure `.env`:
   ```ini
   DB_TYPE=mysql
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=socialguard_db
   ```
4. Run `python -m backend.seed` to seed initial records.

---

## 9. API Reference

### Authentication
- `POST /api/auth/register`: Register user (`name`, `email`, `password`, `confirm_password`)
- `POST /api/auth/login`: Authenticate and issue JWT token (`email`, `password`)
- `GET /api/auth/me`: Retrieve current authenticated user profile (`Bearer <token>`)
- `POST /api/auth/forgot-password`: Initiate password recovery

### Threat Analysis
- `POST /api/analyze`: Analyze text/SMS message (`text`).
- `POST /api/analyze/email`: Analyze email (`sender`, `subject`, `body`).

### History & Records
- `GET /api/history`: List user scan history (Supports `?classification=`, `?type=`, `?search=`)
- `GET /api/history/<id>`: Retrieve full details for specific analysis
- `DELETE /api/history/<id>`: Delete specific record
- `DELETE /api/history`: Clear all analysis history for user

### Intelligence & Admin
- `GET /api/dashboard/stats`: User KPI cards, distribution, 7-day trend, top indicators
- `GET /api/admin/stats`: System-wide KPI cards, classification breakdown, indicators
- `GET /api/admin/users`: Admin view of all registered accounts and scan counts
- `GET /api/safety-tips`: 7 categories of educational security countermeasures
- `GET /api/profile`: User account profile and scan statistics
- `PUT /api/profile`: Update user display name
- `PUT /api/profile/password`: Change account password

---

## 10. Automated Testing

SocialGuard AI includes comprehensive automated unit and API integration test suites:

```bash
python -m pytest backend/tests/ -v
```

Tests cover:
- Health check verification
- User registration validation (length, email format, password matching)
- Login authentication, credential checking, and JWT issuance
- Message analysis with benign text and high-risk OTP scams
- Email analysis with header spoofing and suspicious link flags
- NLP tokenization, entity masking (`token_money`, `token_url`), and preprocessing
- Safe URL inspection (IP host detection, shortener detection, suspicious TLD detection)
- Machine Learning classification and calibrated probability output

---

## 11. Security Considerations

- **Untrusted Input Handling**: User-submitted URLs are parsed strictly using local URI grammar without issuing HTTP requests or following redirects.
- **Credential Safety**: Passwords are never logged or stored in plain text; hashes are generated via PBKDF2 with SHA-256.
- **SQL Injection Prevention**: All queries utilize SQLAlchemy parameterized bindings.
- **Session Security**: JWT tokens include expiration timestamps and signature verification.
