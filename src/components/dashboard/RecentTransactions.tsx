import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency, TransactionWithDate } from '../../lib/supabase';
import { format } from 'date-fns';

const RecentTransactions = () => {
  const { transactions, deleteTransaction, isLoading } = useTransactionStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Take only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);
  
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      ) : recentTransactions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>Belum ada transaksi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              onDelete={handleDelete}
              isDeleteConfirming={deleteConfirm === transaction.id}
              delay={index * 50}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TransactionItemProps {
  transaction: TransactionWithDate;
  onDelete: (id: string) => void;
  isDeleteConfirming: boolean;
  delay: number;
}

const TransactionItem = ({ transaction, onDelete, isDeleteConfirming, delay }: TransactionItemProps) => {
  return (
    <div 
      className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition-all slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center">
        {transaction.type === 'income' ? (
          <ArrowUpCircle size={18} className="text-green-500 mr-3" />
        ) : (
          <ArrowDownCircle size={18} className="text-red-500 mr-3" />
        )}
        <div>
          <p className="font-medium text-slate-800">{transaction.category}</p>
          <p className="text-xs text-slate-500">
            {format(new Date(transaction.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className={`font-medium ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? '+' : '-'} 
          {formatCurrency(transaction.amount)}
        </span>
        
        <button 
          onClick={() => onDelete(transaction.id)}
          className={`ml-3 p-1.5 rounded-full ${
            isDeleteConfirming 
              ? 'bg-red-100 text-red-600' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          } transition-all`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;