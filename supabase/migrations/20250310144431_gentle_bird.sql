/*
  # Create Borrowers Table

  1. New Tables
    - `borrowers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `status` (text, required, default: 'On going')
      - `funds` (numeric, required)
      - `interest_per_month` (numeric, required)
      - `payment_day` (text, required)
      - `description` (text)
      - `start_date` (date, required)
      - `status_for_month` (text)
      - `created_at` (timestamp with time zone, default: now())
      - `updated_at` (timestamp with time zone, default: now())
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `borrowers` table
    - Add policies for authenticated users to:
      - Read their own borrowers
      - Insert new borrowers
      - Update their own borrowers
      - Delete their own borrowers

  3. Functions
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create borrowers table
CREATE TABLE IF NOT EXISTS borrowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'On going',
  funds numeric NOT NULL CHECK (funds >= 0),
  interest_per_month numeric NOT NULL CHECK (interest_per_month >= 0),
  payment_day text NOT NULL,
  description text,
  start_date date NOT NULL,
  status_for_month text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_borrowers_updated_at
  BEFORE UPDATE ON borrowers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Users can view their own borrowers"
  ON borrowers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create borrowers"
  ON borrowers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own borrowers"
  ON borrowers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own borrowers"
  ON borrowers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX borrowers_user_id_idx ON borrowers(user_id);
CREATE INDEX borrowers_status_idx ON borrowers(status);