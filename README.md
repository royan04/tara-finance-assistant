# Tara Finance Assistant

## Overview

Tara Finance Assistant is an AI-powered finance research agent built using TypeScript, Mastra, PostgreSQL, and Groq.

The system allows users to ask natural language questions about their financial data, including:

* Spending analysis
* Expense tracking
* Merchant analysis
* Portfolio performance
* Mutual fund returns
* Holding performance
* Recurring transaction detection

All answers are grounded in PostgreSQL data through tool calls. The language model never directly accesses the database and is instructed not to invent values.

---

# Live Deployment

Production URL:

https://tara-finance-assistant-production.up.railway.app

Public API Endpoint:

POST https://tara-finance-assistant-production.up.railway.app/ask

---

# Technology Stack

* TypeScript
* Node.js
* Mastra
* PostgreSQL
* Groq
* Zod
* Railway

---

# Model Configuration

Provider:

Groq

Model:

groq/llama-3.3-70b-versatile

Reason for selection:

* Fast inference speed
* Reliable tool calling
* Strong reasoning performance
* Suitable for structured financial question answering

---

# Features

## Spending Analysis

Supports:

* Total spending
* Category spending
* Date range filtering
* Transfer exclusion
* Biggest expense detection

Examples:

```text
How much did I spend on food?

How much did I spend between Jan and Mar 2025?

Ignore transfers. What was my spending in Q1 2025?

What was my biggest expense?
```

---

## Merchant Analysis

Supports:

* Top merchants
* Merchant normalization
* Spending aggregation

Examples:

```text
Who are my top merchants?

Which merchant do I spend the most money with?
```

Merchant aliases are normalized during ingestion:

```text
AMAZON.IN        → AMAZON
AMAZON PAY       → AMAZON
SWIGGY INSTAMART → SWIGGY
```

---

## Portfolio Analytics

Supports:

* Portfolio value
* Cost basis
* Profit calculation

Examples:

```text
What is my current portfolio value?

How much profit have I made?
```

---

## Mutual Fund Analytics

Supports:

* Fund returns
* NAV analysis
* Period return calculation

Examples:

```text
What was the return of fund_bluechip from 2024-01-01 to 2025-01-01?
```

---

## Holding Analytics

Supports:

* Holding performance
* Return ranking
* Best-performing holding

Examples:

```text
Which holding has the highest return?

Rank my holdings by return.
```

---

## Recurring Transaction Detection

Supports:

* Subscription detection
* Recurring payment identification

Examples:

```text
Show my recurring transactions.

Which merchants appear repeatedly?
```

---

# Architecture

```text
User
  │
  ▼
POST /ask
  │
  ▼
Tara Agent (Mastra)
  │
  ├── transactionTool
  ├── portfolioTool
  ├── topMerchantsTool
  ├── fundReturnTool
  ├── biggestExpenseTool
  ├── holdingReturnsTool
  └── recurringTransactionsTool
  │
  ▼
PostgreSQL
```

---

# Project Structure

```text
tara-finance-assistant
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
└── docs
    └── screenshots
```

---

# Database Schema

## transactions

Stores financial transactions.

Columns:

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

Columns:

* fund_id
* fund_name
* category

---

## fund_navs

Stores historical NAV values.

Columns:

* id
* fund_id
* nav_date
* nav

---

## holdings

Stores owned fund units.

Columns:

* id
* fund_id
* units
* purchase_date
* purchase_nav

---

# Local PostgreSQL Setup

Database Name:

provue_tara

PostgreSQL Version:

18

Local Connection Example:

```text
postgresql://postgres:<password>@localhost:5432/provue_tara
```

The project was developed and tested locally using PostgreSQL before deployment to Railway PostgreSQL.

---

# Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/provue_tara

DATA_DIR=./data/sample_a

GROQ_API_KEY=<your_groq_api_key>

PORT=8080
```

---

# Installation

Install dependencies:

```bash
npm install
```

---

# Database Setup

Create the database:

```sql
CREATE DATABASE provue_tara;
```

Create the schema using the SQL provided in the project.

---

# Data Ingestion

Load the sample dataset:

```bash
npx tsx scripts/ingest.ts
```

Expected output:

```text
Loading data from: ./data/sample_a
Connected to PostgreSQL
Old data cleared
Inserted transactions
Inserted funds
Inserted holdings
Ingestion completed
```

---

# Running Locally

Start the development server:

```bash
npm run dev
```

Mastra Studio:

```text
http://localhost:4111
```

Mastra API:

```text
http://localhost:4111/api
```

---

# Public API

## POST /ask

Endpoint:

```http
POST /ask
```

Request:

```json
{
  "question": "What is my biggest expense?"
}
```

Response:

```json
{
  "answer": "Your biggest expense is rent, with a total amount of 34774.89."
}
```

---

# Evaluation

Run the evaluation suite:

```bash
npx tsx scripts/run-eval.ts
```

Output:

```text
eval/results.json
```

The evaluation framework verifies:

* Spending calculations
* Merchant analysis
* Portfolio calculations
* Fund returns
* Holding returns
* Recurring transaction detection
* No-data handling

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

* Transaction data is provided through the supplied datasets.
* Dates are stored in ISO format.
* Merchant aliases are normalized during ingestion.
* Portfolio calculations use the latest available NAV.
* Transfer transactions can be excluded when requested.

---

# Future Improvements

* Multi-user support
* Authentication and authorization
* Real-time market data integration
* Portfolio forecasting
* Web dashboard UI
* Advanced recurring payment detection
* Investment recommendation engine

---


# Deployment

Railway:

https://tara-finance-assistant-production.up.railway.app
