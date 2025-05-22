/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (enum: 'income' or 'expense')
      - `category` (text)
      - `amount` (decimal)
      - `description` (text, optional)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to:
      - Select only their own transactions
      - Insert only transactions linked to their user_id
      - Update only their own transactions
      - Delete only their own transactions
*/

-- Create enum type for transaction type
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type transaction_type NOT NULL,
  category text NOT NULL,
  amount decimal(12,2) NOT NULL CHECK (amount > 0),
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Create index on type for faster filtering
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Create index on created_at for date range queries
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Select policy: Users can only view their own transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Insert policy: Users can only insert transactions linked to themselves
CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update policy: Users can only update their own transactions
CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete policy: Users can only delete their own transactions
CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);