/*
  # Create borrowers table

  1. New Tables
    - `borrowers`
      - `id` (uuid, primary key)
      - `firstname` (text)
      - `lastname` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `socialsecuritynumber` (text)
      - `creditscore` (integer)
      - `employmentstatus` (text)
      - `employername` (text, nullable)
      - `monthlyincome` (numeric)
      - `loanstatus` (text)
      - `registrationdate` (timestamp with time zone)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on borrowers table
    - Add policies for authenticated users
*/

-- Create borrowers table
CREATE TABLE IF NOT EXISTS borrowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  address text NOT NULL,
  socialsecuritynumber text NOT NULL,
  creditscore integer NOT NULL CHECK (creditscore >= 300 AND creditscore <= 850),
  employmentstatus text NOT NULL CHECK (employmentstatus IN ('employed', 'self-employed', 'unemployed', 'retired')),
  employername text,
  monthlyincome numeric NOT NULL CHECK (monthlyincome >= 0),
  loanstatus text NOT NULL CHECK (loanstatus IN ('active', 'pending', 'completed', 'defaulted')),
  registrationdate timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view borrowers"
  ON borrowers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create borrowers"
  ON borrowers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update borrowers"
  ON borrowers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete borrowers"
  ON borrowers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_borrowers_updated_at
  BEFORE UPDATE ON borrowers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX borrowers_email_idx ON borrowers(email);
CREATE INDEX borrowers_loan_status_idx ON borrowers(loanstatus);
CREATE INDEX borrowers_registration_date_idx ON borrowers(registrationdate);