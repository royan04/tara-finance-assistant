CREATE TABLE IF NOT EXISTS transactions (
    id            TEXT PRIMARY KEY,
    date          DATE NOT NULL,
    merchant      TEXT,
    merchant_normalized TEXT,
    category      TEXT,
    amount        NUMERIC(12, 2),
    currency      TEXT,
    memo          TEXT
);

CREATE TABLE IF NOT EXISTS funds (
    fund_id       TEXT PRIMARY KEY,
    fund_name     TEXT NOT NULL,
    category      TEXT
);

CREATE TABLE IF NOT EXISTS fund_navs (
    id            SERIAL PRIMARY KEY,
    fund_id       TEXT NOT NULL REFERENCES funds(fund_id) ON DELETE CASCADE,
    nav_date      DATE NOT NULL,
    nav           NUMERIC(12, 4)
);

CREATE TABLE IF NOT EXISTS holdings (
    id            SERIAL PRIMARY KEY,
    fund_id       TEXT NOT NULL REFERENCES funds(fund_id) ON DELETE CASCADE,
    units         NUMERIC(18, 6),
    purchase_date DATE,
    purchase_nav  NUMERIC(12, 4)
);
