import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTransactionStore } from '../../stores/transactionStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransactionChart = () => {
  const { transactions, dateFilter } = useTransactionStore();
  
  // Prepare chart data based on current filter or default to current month
  const chartData = useMemo(() => {
    const now = new Date();
    const startDate = dateFilter.startDate || startOfMonth(now);
    const endDate = dateFilter.endDate || endOfMonth(now);
    
    // Generate array of days in the selected period
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Initialize data arrays
    const incomeData = Array(days.length).fill(0);
    const expenseData = Array(days.length).fill(0);
    
    // Aggregate transaction amounts by day
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      const dayIndex = days.findIndex(day => isSameDay(day, transactionDate));
      
      if (dayIndex !== -1) {
        if (transaction.type === 'income') {
          incomeData[dayIndex] += transaction.amount;
        } else {
          expenseData[dayIndex] += transaction.amount;
        }
      }
    });
    
    return {
      labels: days.map(day => format(day, 'MMM d')),
      datasets: [
        {
          label: 'Pendapatan',
          data: incomeData,
          backgroundColor: 'rgba(74, 222, 128, 0.6)',
          borderColor: 'rgba(74, 222, 128, 1)',
          borderWidth: 1,
        },
        {
          label: 'Pengeluaran',
          data: expenseData,
          backgroundColor: 'rgba(248, 113, 113, 0.6)',
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, dateFilter]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#334155',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
        boxWidth: 8,
        bodyFont: {
          family: 'Inter, sans-serif',
        },
        titleFont: {
          family: 'Inter, sans-serif',
          weight: 'bold',
        },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(203, 213, 225, 0.3)',
        },
        ticks: {
          callback: function(value: number) {
            return '$' + value;
          },
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="card h-80">
      <h3 className="text-lg font-semibold mb-4">Pendapatan vs Pengeluaran</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionChart;