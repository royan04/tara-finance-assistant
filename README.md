# Tara Finance Assistant

## Overview

Tara Finance Assistant is an AI-powered financial analysis system built using Mastra, Groq, PostgreSQL, and TypeScript.

The assistant allows users to ask natural language questions about:

* Portfolio performance
* Spending analysis
* Mutual fund returns
* Holding performance
* Top merchants
* Recurring transactions
* Expense tracking

All financial data is stored in PostgreSQL and accessed through tool-based retrieval rather than direct LLM access.

---

# Technology Stack

* TypeScript
* Node.js
* Mastra
* PostgreSQL
* Groq (Llama 3.3 70B)
* Zod

---

# Features

## Portfolio Analytics

* Current portfolio value
* Cost basis
* Profit calculation

Example:

```text
What is my current portfolio value?
```

---

## Spending Analytics

* Category-wise spending
* Date-range spending
* Transfer exclusion
* Biggest expense detection

Examples:

```text
How much did I spend on food?

How much did I spend between Jan and Mar 2025?

Ignore transfers. What was my spending in Q1 2025?
```

---

## Merchant Analysis

* Top merchants
* Merchant alias normalization

Examples:

```text
Who are my top merchants?
```

Merchant aliases are normalized during ingestion:

```text
AMAZON.IN        → AMAZON
AMAZON PAY       → AMAZON
SWIGGY INSTAMART → SWIGGY
```

---

## Mutual Fund Analytics

* Fund return between dates
* Holding performance
* Holding ranking

Examples:

```text
What was the return of fund_bluechip from 2024-01-01 to 2025-01-01?

Which holding has the best realised return?

Rank my holdings by return.
```

---

## Recurring Transaction Detection

Examples:

```text
Show my recurring payments.

Which transactions look like recurring subscriptions?
```

---

# Project Structure

```text
tara-finance-agent
│
├── README.md
├── DESIGN.md
├── AGENTS.md
├── package.json
├── .env.example
│
├── src
│   ├── db
│   ├── services
│   └── mastra
│
├── scripts
│   ├── ingest.ts
│   ├── run-eval.ts
│   └── test
│
├── eval
│   ├── questions.json
│   └── results.json
│
├── data
│   ├── sample_a
│   ├── sample_b
│   └── sample_c
│
└── .agents
```

---

# Database Schema

## transactions

Stores transaction history.

Fields:

* id
* date
* merchant
* merchant_normalized
* category
* amount
* currency
* memo

---

## funds

Stores mutual fund metadata.

Fields:

* fund_id
* fund_name
* category

---

## fund_navs

Stores historical NAV values.

Fields:

* fund_id
* nav_date
* nav

---

## holdings

Stores owned mutual fund units.

Fields:

* fund_id
* units
* purchase_date
* purchase_nav

---

# Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Create PostgreSQL Database

```sql
CREATE DATABASE provue_tara;
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/provue_tara

DATA_DIR=./data/sample_a

GROQ_API_KEY=<your_groq_api_key>
```

---

## 4. Load Dataset

```bash
npx tsx scripts/ingest.ts
```

Expected output:

```text
Loading data from: ./data/sample_a
Connected to PostgreSQL
Old data cleared
Inserted 1500 transactions
Inserted 8 funds
Inserted 8 holdings
Ingestion completed
```

---

# Running the Application

Start the Mastra development server:

```bash
npm run dev
```

The application will be available at:

```text
Studio: http://localhost:4111

API: http://localhost:4111/api
```

---

# API Usage

## Generate Response

Endpoint:

```http
POST /api/agents/tara-agent/generate
```

Example Request:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is my current portfolio value?"
    }
  ]
}
```

Example Response:

```json
{
  "text": "Your current portfolio value is $119,983.80."
}
```

---

# Evaluation

Run evaluation questions:

```bash
npx tsx scripts/run-eval.ts
```

Results will be written to:

```text
eval/results.json
```

---

# Example Questions

```text
What is my current portfolio value?

What was my biggest expense?

Who are my top merchants?

How much did I spend on food?

How much did I spend between Jan and Mar 2025?

Which holding has the best realised return?

Rank my holdings by return.

Show my recurring payments.

What was the return of fund_bluechip from 2024-01-01 to 2025-01-01?
```

---

# Assumptions

* Transaction data is available in the provided dataset.
* Dates are stored in ISO format.
* Merchant aliases are normalized during ingestion.
* Portfolio calculations use the latest available NAV.

---

# Future Improvements

* Multi-user support
* Authentication and authorization
* Portfolio forecasting
* Real-time market data integration
* Dashboard UI
* Advanced subscription detection
* Investment recommendation engine
