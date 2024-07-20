CREATE DATABASE walletdb OWNER postgres;

GRANT ALL PRIVILEGES ON DATABASE walletdb TO postgres;

\c walletdb

CREATE TABLE customer (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customer(id) ON DELETE CASCADE,
  balance NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES account(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.customer (id,"name",email,created_at,updated_at) VALUES
	 ('16153f35-5b0a-4eb6-a4b4-c1ea55816bdc','yul','brynnersb@gmail.com','2024-07-20 20:15:20','2024-07-20 20:15:20');


INSERT INTO public.account (id,customer_id,balance,created_at,updated_at) VALUES
	 ('16153f35-5b0a-4eb6-a4b4-c1ea55816bde','16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',0.00,'2024-07-20 20:15:20','2024-07-20 20:15:20');

