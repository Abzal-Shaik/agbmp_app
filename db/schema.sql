-- AgBMP Loan Management System Database Schema
-- Compatible with SQLite, PostgreSQL, and MySQL

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_code VARCHAR(50) UNIQUE NOT NULL,
  org_name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  primary_contact_name VARCHAR(100) NOT NULL,
  primary_contact_title VARCHAR(100),
  primary_contact_phone VARCHAR(50),
  primary_contact_email VARCHAR(100) NOT NULL,
  receive_reporting_emails BOOLEAN DEFAULT 1,
  service_areas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Loan Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_number VARCHAR(50) UNIQUE NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  lender_org VARCHAR(255) NOT NULL,
  project_category VARCHAR(150) NOT NULL,
  county VARCHAR(100) NOT NULL,
  requested_amount DECIMAL(15, 2) NOT NULL,
  estimated_completion DATE,
  submission_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Submitted', -- Submitted, Under Review, Approved, Denied, Expired
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Loans Table
CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_number VARCHAR(50) UNIQUE NOT NULL,
  application_id INTEGER,
  borrower_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  remaining_balance DECIMAL(15, 2) NOT NULL,
  min_due DECIMAL(15, 2) NOT NULL,
  next_due_date DATE,
  status VARCHAR(50) DEFAULT 'Current', -- Current, Paid Off, Defaulted
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- 4. Remittance Statements Table
CREATE TABLE IF NOT EXISTS remittance_statements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_org VARCHAR(255) NOT NULL,
  remittance_period VARCHAR(100) NOT NULL,
  auto_gen_date DATE NOT NULL,
  pooled_statement_amount DECIMAL(15, 2) NOT NULL,
  payment_mode VARCHAR(20) DEFAULT 'Check', -- Check vs EFT
  allow_eft BOOLEAN DEFAULT 1,
  eft_description VARCHAR(20),
  status VARCHAR(50) DEFAULT 'Not Started', -- Not Started, Lender Submitted, Cashier Deposited, MDA Matched
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Activity Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  statement_id INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actor VARCHAR(100) NOT NULL,
  action_executed VARCHAR(100) NOT NULL,
  notes TEXT,
  FOREIGN KEY (statement_id) REFERENCES remittance_statements(id)
);

-- Seed Default Organization Data
INSERT INTO organizations (org_code, org_name, address, primary_contact_name, primary_contact_title, primary_contact_phone, primary_contact_email, receive_reporting_emails, service_areas)
VALUES (
  'ORG-001',
  'Merchants Bank - Cannon Falls',
  '300 Main St W, Cannon Falls, Minnesota, 55009',
  'Brian Hokanson',
  'Senior Agricultural Loan Manager',
  '(507) 263-4214',
  'BEHokanson@merchantsbank.com',
  1,
  'Dakota, Goodhue, Hennepin, Ramsey, Rice, Washington'
);

-- Seed Initial Applications
INSERT INTO applications (app_number, applicant_name, lender_org, project_category, county, requested_amount, estimated_completion, submission_date, status)
VALUES 
  ('APP-2026-089', 'John Doe Farms LLC', 'Merchants Bank - Cannon Falls', 'Waste Management & Manure Storage', 'Goodhue', 45000.00, '2026-11-30', '2026-07-15', 'Submitted'),
  ('APP-2026-092', 'Valley View Ag Inc', 'Merchants Bank - Cannon Falls', 'Conservation Tillage Equipment', 'Dakota', 68500.00, '2026-12-15', '2026-07-20', 'Under Review'),
  ('APP-2026-095', 'Green Pastures Dairy', 'Merchants Bank - Cannon Falls', 'Septic System Upgrade', 'Rice', 12000.00, '2026-10-31', '2026-08-01', 'Submitted');
