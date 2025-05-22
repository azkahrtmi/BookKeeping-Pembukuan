import { useEffect } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import SummaryCards from '../components/dashboard/SummaryCards';
import TransactionChart from '../components/dashboard/TransactionChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import DateFilter from '../components/dashboard/DateFilter';

const Dashboard = () => {
  const { fetchTransactions, isLoading } = useTransactionStore();
  
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  return (
    <div className="page-container">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <DateFilter />
      </div>
      
      {/* Summary Cards */}
      <SummaryCards />
      
      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <TransactionChart />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;