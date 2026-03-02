# SENIOR FRONTEND ENGINEER

**Goal:** We want to understand how you think about structure, correctness, and maintainability, not how much code you can write. You are not expected to finish everything.

## SCENARIO

You are implementing a small users Widget that will be reused across multiple products. Assume this code will live in production and be maintained by other engineers. Prioritize clarity, correctness, and sensible decisions.

---

## PART 1 — PYTHON API

Create an endpoint that returns mock data, see:
- ./data/mock_data.csv

**Requirements:**
- Use Python (FastAPI).
- Read `data/mock_data.csv` and derive the three stats from the dataset. The CSV has: id, first_name, last_name, email, gender, ip_address. Derivation rules can be minimal/simulated (e.g. users = row count, active_today = fixed % of users, conversion_rate = constant); document your rule.
- Define a response model/type.
- Handle one realistic edge case (e.g. missing or malformed `data/mock_data.csv` → 503/500 with clear error).
- Keep implementation minimal.

---

## PART 2 — REACT + TYPESCRIPT

Implement:
- Fetch/Query the data from part 1.
- Display users, active today, and conversion rate (as %).
- Include loading state and error state.
- Handle invalid or unexpected data (e.g. wrong shape, non-numeric values) without crashing.
- Use proper TypeScript typing.
- Assume this component will be reused across multiple applications. Avoid over-engineering.

---

## PART 3 — ENGINEERING DECISION

Add one improvement you believe a senior engineer would include (e.g. custom hook, reusable component, validation layer, formatting utility, accessibility improvement, or error boundary).

Add a short comment explaining why this matters at scale.

---

## AI USAGE

You are welcome to use AI tools (ChatGPT, Copilot, etc.). We do not evaluate whether code was written with AI assistance. What matters is that you can clearly explain: your structure and decisions, tradeoffs you made, how your solution works, and what you would change with more time.

---

## DELIVERABLES

Provide:

- GitHub repo or zip file.
- README including:
  - how to run backend and frontend
  - one tradeoff you made
  - one thing you intentionally did `not` implement

Evaluation focuses on structure, typing, edge cases, UI clarity, and reasoning.

---
