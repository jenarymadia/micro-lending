/*
  # Multi-tenancy Schema Setup

  1. New Tables
    - `tenants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    - `users_tenants`
      - `user_id` (uuid, references auth.users)
      - `tenant_id` (uuid, references tenants)
      - `role` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for tenant access
    - Add policies for user-tenant relationships
*/

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create users_tenants junction table
CREATE TABLE IF NOT EXISTS users_tenants (
  user_id uuid REFERENCES auth.users NOT NULL,
  tenant_id uuid REFERENCES tenants NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, tenant_id)
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_tenants ENABLE ROW LEVEL SECURITY;

-- Policies for tenants
CREATE POLICY "Users can view their tenants"
  ON tenants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_tenants
      WHERE tenant_id = tenants.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tenants"
  ON tenants
  FOR INSERT
  WITH CHECK (true);

-- Policies for users_tenants
CREATE POLICY "Users can view their tenant memberships"
  ON users_tenants
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their tenant memberships"
  ON users_tenants
  FOR INSERT
  WITH CHECK (user_id = auth.uid());