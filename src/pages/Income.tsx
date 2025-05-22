import { useEffect } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import DateFilter from '../components/dashboard/DateFilter';

const Income = () => {
  const { fetchTransactions } = useTransactionStore();
  
  useEffect(() => {
    fetchTransactions('income');
  }, [fetchTransactions]);
  
  return (
    <div className="page-container">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Income</h1>
        <DateFilter />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <TransactionForm type="income" />
        </div>
        <div className="lg:col-span-2">
          <TransactionList type="income" />
        </div>
      </div>
    </div>
  );
};

export default Income;