import { createClient } from '@supabase/supabase-js';

// These would normally be in environment variables
// For this demo, we'll use hardcoded values until the Supabase connection is established
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description?: string;
  created_at: string;
};

export type TransactionWithDate = Transaction & {
  date: Date;
};

// Default categories
export const DEFAULT_CATEGORIES = {
  income: ['Gaji', 'Freelance', 'Investasi', 'Lainnya'],
  expense: ['Makanan', 'Tranportasi', 'KPR', 'Hiburan', 'Lainnya']
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

// Helper to get transaction data with date filters
export const getTransactions = async (
  type?: TransactionType,
  startDate?: Date,
  endDate?: Date
): Promise<TransactionWithDate[]> => {
  let query = supabase
    .from('transactions')
    .select('*');
  
  // Add type filter if provided
  if (type) {
    query = query.eq('type', type);
  }
  
  // Add date filters if provided
  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  
  if (endDate) {
    // Set time to end of day for the end date
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    query = query.lte('created_at', adjustedEndDate.toISOString());
  }
  
  // Order by most recent first
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  // Convert created_at strings to Date objects
  return (data as Transaction[]).map(transaction => ({
    ...transaction,
    date: new Date(transaction.created_at)
  }));
};