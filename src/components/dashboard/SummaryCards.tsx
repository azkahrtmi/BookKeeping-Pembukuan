import { useTransactionStore } from '../../stores/transactionStore';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/supabase';

const SummaryCards = () => {
  const { getTotalIncome, getTotalExpenses, getBalance } = useTransactionStore();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  
  const cards = [
    {
      title: 'Total Pendapatan',
      value: formatCurrency(totalIncome),
      icon: <ArrowUpCircle size={20} className="text-green-500" />,
      color: 'bg-green-50 border-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'Total Pengeluaran',
      value: formatCurrency(totalExpenses),
      icon: <ArrowDownCircle size={20} className="text-red-500" />,
      color: 'bg-red-50 border-red-100',
      textColor: 'text-red-700'
    },
    {
      title: 'Balance',
      value: formatCurrency(balance),
      icon: <Wallet size={20} className="text-blue-800" />,
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`card ${card.color} border transition-all duration-300 hover:shadow-md slide-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className={`text-2xl font-semibold mt-1 ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;