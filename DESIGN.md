# Tara Finance Assistant - Design Document

## 1. Overview

Tara Finance Assistant is a finance research agent built using TypeScript, Mastra, PostgreSQL, and Groq.

The goal of the system is to answer financial questions using structured financial data rather than relying on model knowledge.

The assistant supports:

* Spending analysis
* Merchant analysis
* Portfolio analytics
* Mutual fund performance
* Holding performance
* Recurring transaction detection

All financial answers are grounded in PostgreSQL through tool calls.

---

# 2. System Architecture

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
  ├── biggestExpenseTool
  ├── fundReturnTool
  ├── holdingReturnsTool
  └── recurringTransactionsTool
  │
  ▼
Services Layer
  │
  ▼
PostgreSQL
```

The architecture separates:

* Reasoning (LLM)
* Tool orchestration
* Business logic
* Data storage

This reduces hallucinations and makes calculations deterministic.

---

# 3. PostgreSQL Schema

## transactions

Stores all financial transactions.

| Column              | Type             |
| ------------------- | ---------------- |
| id                  | TEXT PRIMARY KEY |
| date                | DATE             |
| merchant            | TEXT             |
| merchant_normalized | TEXT             |
| category            | TEXT             |
| amount              | NUMERIC          |
| currency            | TEXT             |
| memo                | TEXT             |

Reason:

This table supports all spending analysis queries.

---

## funds

Stores mutual fund metadata.

| Column    | Type             |
| --------- | ---------------- |
| fund_id   | TEXT PRIMARY KEY |
| fund_name | TEXT             |
| category  | TEXT             |

Reason:

Separates fund metadata from NAV history.

---

## fund_navs

Stores historical NAV values.

| Column   | Type               |
| -------- | ------------------ |
| id       | SERIAL PRIMARY KEY |
| fund_id  | TEXT               |
| nav_date | DATE               |
| nav      | NUMERIC            |

Foreign Key:

```sql
fund_id REFERENCES funds(fund_id)
```

Reason:

Allows efficient period return calculations.

---

## holdings

Stores purchased fund units.

| Column        | Type               |
| ------------- | ------------------ |
| id            | SERIAL PRIMARY KEY |
| fund_id       | TEXT               |
| units         | NUMERIC            |
| purchase_date | DATE               |
| purchase_nav  | NUMERIC            |

Foreign Key:

```sql
fund_id REFERENCES funds(fund_id)
```

Reason:

Supports portfolio and holding return calculations.

---

# 4. Tool Design

The system uses multiple focused tools instead of one large tool.

## transactionTool

Responsible for:

* Category spend
* Date filtering
* Transfer exclusion

Reason:

Transaction analysis is the most frequently used operation.

---

## portfolioTool

Responsible for:

* Portfolio value
* Cost basis
* Profit calculation

Reason:

Portfolio calculations require joining holdings and NAV data.

---

## topMerchantsTool

Responsible for:

* Merchant aggregation
* Merchant ranking

Reason:

Merchant analysis is independent from portfolio analytics.

---

## biggestExpenseTool

Responsible for:

* Largest transaction lookup

Reason:

Simple query optimized separately.

---

## fundReturnTool

Responsible for:

* Period return calculations

Reason:

Requires date-based NAV lookups.

---

## holdingReturnsTool

Responsible for:

* Holding ranking
* Return comparisons

Reason:

Combines holdings and NAV information.

---

## recurringTransactionsTool

Responsible for:

* Subscription detection
* Recurring payment analysis

Reason:

Uses frequency-based aggregation logic.

---

# 5. Grounding and Hallucination Prevention

The model never directly accesses financial data.

All financial answers are generated through tool calls.

The agent instructions explicitly require:

* Use tools whenever data is needed
* Never invent values
* Return no-data responses when tools return:

```json
{
  "found": false
}
```

This ensures responses remain grounded in PostgreSQL.

---

# 6. Financial Formulas

## Spend

```text
Spend = SUM(amount)
```

---

## Net Spend

Transfers are excluded.

```text
Net Spend = SUM(amount WHERE category <> 'transfer')
```

---

## Merchant Matching

Merchants are normalized during ingestion.

Examples:

```text
AMAZON.IN → AMAZON
AMAZON PAY → AMAZON
SWIGGY INSTAMART → SWIGGY
```

This improves aggregation quality.

---

## Recurring Detection

A merchant is considered recurring when:

```sql
COUNT(*) >= 3
```

Transactions are grouped by normalized merchant.

---

## Fund Period Return

```text
Return % =
((End NAV - Start NAV) / Start NAV) × 100
```

---

## Holding Realised Return

```text
Cost Basis =
Units × Purchase NAV

Current Value =
Units × Latest NAV

Return % =
((Current Value - Cost Basis) / Cost Basis) × 100
```

---

# 7. Evaluation Strategy

The evaluation framework is implemented through:

```text
scripts/run-eval.ts
eval/questions.json
eval/results.json
```

Coverage includes:

* Portfolio questions
* Spending questions
* Merchant questions
* Fund return calculations
* Holding return calculations
* Recurring transactions
* No-data scenarios

The evaluation script compares generated answers against expected outputs and records pass/fail results.

---

# 8. Observability

Observability was added through:

* Mastra logs
* Railway deployment logs
* Tool execution traces

Evidence included:

* Successful query execution
* Database connection logs
* No-data handling example

Example successful run:

```text
What is my biggest expense?
```

Example failure/no-data run:

```text
How much did I spend in 2035?
```

---

# 9. Deployment

Platform:

Railway

Components:

* Railway Application Service
* Railway PostgreSQL
* Groq API

Advantages:

* Simple deployment
* Managed PostgreSQL
* Automatic builds

Tradeoffs:

* Shared free-tier resources
* Cold starts possible
* Public endpoint latency depends on provider availability

---

# 10. Failure Modes

Potential failure cases:

## LLM Tool Selection Errors

The model may choose an incorrect tool.

Mitigation:

* Detailed agent instructions
* Narrow tool responsibilities

---

## Poor Data Quality

Incorrect merchant names or categories can affect analytics.

Mitigation:

* Merchant normalization during ingestion

---

## Empty Database

Queries may return no results.

Mitigation:

* Explicit no-data handling

---

## External Dependency Failure

Groq or Railway outages can prevent responses.

Mitigation:

* Error handling and logging

---

# 11. Future Improvements

* Authentication
* Multi-user support
* Dashboard UI
* Portfolio forecasting
* Real-time market data
* Advanced recurring payment detection
* Better evaluation coverage
* Monitoring dashboards
