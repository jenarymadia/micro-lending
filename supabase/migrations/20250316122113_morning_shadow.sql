/*
  # Update borrowers table schema

  1. Changes
    - Add indexes for better query performance
    - Add trigger for updating the updated_at column

  Note: Table and policies already exist from previous migration
*/

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS borrowers_email_idx ON borrowers(email);
CREATE INDEX IF NOT EXISTS borrowers_loan_status_idx ON borrowers(loanstatus);
CREATE INDEX IF NOT EXISTS borrowers_registration_date_idx ON borrowers(registrationdate);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_borrowers_updated_at ON borrowers;

-- Create trigger
CREATE TRIGGER update_borrowers_updated_at
  BEFORE UPDATE ON borrowers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();