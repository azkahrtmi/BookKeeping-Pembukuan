import { useState } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { Transaction, formatCurrency } from '../../lib/supabase';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Search } from 'lucide-react';

interface TransactionListProps {
  type?: 'income' | 'expense';
}

const TransactionList = ({ type }: TransactionListProps) => {
  const { transactions, deleteTransaction, isLoading } = useTransactionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Filter transactions based on type and search term
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type if specified
    if (type && transaction.type !== type) {
      return false;
    }
    
    // Filter by search term if provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.category.toLowerCase().includes(searchLower) ||
        (transaction.description || '').toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTransaction(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        {type ? `${type === 'income' ? 'Income' : 'Expense'} Transactions` : 'All Transactions'}
      </h3>
      
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No transactions found.</p>
          {searchTerm ? (
            <p className="text-sm mt-1">Try changing your search term.</p>
          ) : type ? (
            <p className="text-sm mt-1">Add your first {type} to see it here.</p>
          ) : (
            <p className="text-sm mt-1">Add a transaction to see it here.</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-2 font-semibold text-slate-500 text-sm">Date</th>
                <th className="pb-2 font-semibold text-slate-500 text-sm">Category</th>
                <th className="pb-2 font-semibold text-slate-500 text-sm">Description</th>
                <th className="pb-2 font-semibold text-slate-500 text-sm text-right">Amount</th>
                <th className="pb-2 font-semibold text-slate-500 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={handleDelete}
                  isDeleteConfirming={deleteConfirm === transaction.id}
                  delay={index * 50}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  isDeleteConfirming: boolean;
  delay: number;
}

const TransactionRow = ({ transaction, onDelete, isDeleteConfirming, delay }: TransactionRowProps) => {
  return (
    <tr 
      className="hover:bg-slate-50 transition-colors slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <td className="py-3 text-sm text-slate-600">
        {format(new Date(transaction.created_at), 'MMM d, yyyy')}
      </td>
      <td className="py-3">
        <div className="flex items-center">
          {transaction.type === 'income' ? (
            <ArrowUpCircle size={16} className="text-green-500 mr-2" />
          ) : (
            <ArrowDownCircle size={16} className="text-red-500 mr-2" />
          )}
          <span className="text-slate-800">{transaction.category}</span>
        </div>
      </td>
      <td className="py-3 text-sm text-slate-600 max-w-xs truncate">
        {transaction.description || '-'}
      </td>
      <td className={`py-3 text-right font-medium ${
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'income' ? '+' : '-'} 
        {formatCurrency(transaction.amount)}
      </td>
      <td className="py-3 text-right">
        <button 
          onClick={() => onDelete(transaction.id)}
          className={`p-1.5 rounded-full ${
            isDeleteConfirming 
              ? 'bg-red-100 text-red-600' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          } transition-all`}
          title={isDeleteConfirming ? 'Click again to confirm' : 'Delete'}
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default TransactionList;