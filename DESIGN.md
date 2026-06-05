# Tara Finance Assistant - Design Document

## 1. Overview

Tara Finance Assistant is an AI-powered financial analysis system built using Mastra, Groq LLM, PostgreSQL, and TypeScript.

The system allows users to ask natural language questions about:

* Portfolio performance
* Mutual fund returns
* Spending analysis
* Top merchants
* Recurring transactions
* Holding performance

The assistant retrieves data using tools connected to PostgreSQL and generates responses using a Large Language Model.

---

## 2. Architecture

User Question

↓

Tara Agent (Mastra)

↓

Tools

↓

Services

↓

PostgreSQL

### Components

#### Agent Layer

* Tara Finance Assistant
* Groq Llama 3.3 70B
* Tool selection
* Response generation

#### Tool Layer

* portfolioTool
* transactionTool
* topMerchantsTool
* biggestExpenseTool
* fundReturnTool
* holdingReturnsTool
* recurringTransactionsTool

#### Service Layer

* portfolioService
* transactionService
* fundService
* holdingService

#### Database Layer

PostgreSQL stores:

* Transactions
* Funds
* NAV history
* Holdings

---

## 3. Database Schema

### transactions

Stores user spending history.

Fields:

* id
* date
* merchant
* merchant_normalized
* category
* amount
* currency
* memo

### funds

Stores mutual fund metadata.

Fields:

* fund_id
* fund_name
* category

### fund_navs

Stores NAV history.

Fields:

* fund_id
* nav_date
* nav

### holdings

Stores owned mutual fund units.

Fields:

* fund_id
* units
* purchase_date
* purchase_nav

---

## 4. Key Design Decisions

### Merchant Normalization

Merchants are normalized during ingestion.

Examples:

* AMAZON.IN → AMAZON
* AMAZON PAY → AMAZON
* SWIGGY INSTAMART → SWIGGY

This improves spending aggregation accuracy.

### Tool-Based Retrieval

The LLM never directly accesses the database.

All financial data is retrieved through tools.

### PostgreSQL

PostgreSQL was selected because:

* Structured data
* Efficient aggregation
* SQL analytics support
* Easy deployment

---

## 5. Limitations

* Date parsing depends on LLM interpretation.
* Subscription detection is heuristic-based.
* No authentication layer.
* Single-user dataset.

---

## 6. Future Improvements

* User authentication
* Multi-user support
* Portfolio forecasting
* Investment recommendations
* Dashboard UI
* Real-time market data integration
