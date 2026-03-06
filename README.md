# Interview Assignment — Users Widget (Parts 1–3)

This repository contains a small reusable **Users Widget** implemented with:

- **Backend (FastAPI)**: exposes `GET /stats` derived from `./data/mock_data.csv`
- **Frontend (React + TypeScript)**: fetches stats from the backend and displays **users**, **active today**, and **conversion rate** (as %) with loading + error states and runtime validation

---

## How to run

## 1) Backend (FastAPI)

### Requirements

- Python 3.x

### Run

From the repo root (where `main.py` exists):

```bash
source .venv/bin/activate
python3 -m pip install fastapi uvicorn
python3 -m uvicorn main:app --reload

```

Backend URLs

Endpoint: http://127.0.0.1:8000/stats
Swagger UI: http://127.0.0.1:8000/docs

---

Derivation rules (documented)

users = number of non-empty rows in data/mock_data.csv

active_today = simulated as round(users * 0.20)

conversion_rate = constant 0.035 (3.5%)

---

Edge case handling

Missing data/mock_data.csv → returns 503

Malformed CSV or missing required columns → returns 500 with a clear message

---

## 2) Frontend (React + TypeScript)

### Requirements

- Node.js + npm

### Run

From the repo root:
```bash
cd frontend
npm install
npm start
Frontend URL

http://localhost:3000
```

Local dev API access (proxy)

To avoid CORS issues in local development, CRA uses a proxy configured in frontend/package.json:

"proxy": "http://127.0.0.1:8000"

With proxy enabled, the widget calls:

/stats (proxied to the backend)

---

Engineering notes (structure, typing, edge cases, UI clarity, reasoning)
Structure

Backend - Minimal FastAPI app with a single /stats endpoint reading data/mock_data.csv

Frontend:

frontend/src/api/stats.ts: fetch + runtime validation (parseStats) and typing (StatsResponse)

frontend/src/hooks/useStatsQuery.ts: reusable hook encapsulating loading/error/success + retry + abort handling (Part 3 improvement)

frontend/src/components/UsersStatsWidget.tsx: presentation component that renders UI states and formatted output

frontend/src/App.tsx: mounts the widget and uses endpointUrl="/stats"

---

Key decisions

Runtime validation is used even with TypeScript because network responses are untrusted at runtime. Invalid/unexpected response shapes are handled gracefully without crashing the UI.

The widget renders explicit loading and error states and provides a Retry action.

Fetching uses AbortController and abort errors are ignored to avoid setting state after unmount and to behave safely in React 18 dev behavior.

---

Tradeoff (one I made)

I intentionally avoided adding a third-party data fetching/caching library (e.g. React Query) to keep the solution minimal and dependency-light for reuse across multiple applications.

One thing I intentionally did not implement

I did not add automated tests (unit tests for parseStats and component tests for loading/error/success states). With more time, I would add:

unit tests for parseStats runtime validation

component tests for loading/error/success rendering

```
