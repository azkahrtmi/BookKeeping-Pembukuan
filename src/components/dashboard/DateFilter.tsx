import { useState } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';

const DateFilter = () => {
  const { dateFilter, setDateFilter } = useTransactionStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const predefinedRanges = [
    { 
      label: 'Bulan Ini', 
      range: () => ({ 
        startDate: startOfMonth(new Date()), 
        endDate: endOfMonth(new Date()) 
      }) 
    },
    { 
      label: 'Bulan Lalu', 
      range: () => {
        const lastMonth = subMonths(new Date(), 1);
        return { 
          startDate: startOfMonth(lastMonth), 
          endDate: endOfMonth(lastMonth) 
        };
      }
    },
    { 
      label: '3 Bulan Terakhir', 
      range: () => ({ 
        startDate: startOfMonth(subMonths(new Date(), 2)), 
        endDate: endOfMonth(new Date()) 
      }) 
    },
    { 
      label: 'Tahun Ini', 
      range: () => ({ 
        startDate: startOfYear(new Date()), 
        endDate: endOfYear(new Date()) 
      }) 
    },
    { 
      label: 'Setiap Waktu', 
      range: () => ({ 
        startDate: null, 
        endDate: null 
      }) 
    },
  ];
  
  const applyFilter = (rangeFn: () => { startDate: Date | null, endDate: Date | null }) => {
    const range = rangeFn();
    setDateFilter(range);
    setIsOpen(false);
  };
  
  // Format the current filter for display
  const formatCurrentFilter = () => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      return 'Setiap Waktu';
    }
    
    if (dateFilter.startDate && dateFilter.endDate) {
      return `${format(dateFilter.startDate, 'MMM d, yyyy')} - ${format(dateFilter.endDate, 'MMM d, yyyy')}`;
    }
    
    if (dateFilter.startDate) {
      return `From ${format(dateFilter.startDate, 'MMM d, yyyy')}`;
    }
    
    if (dateFilter.endDate) {
      return `Until ${format(dateFilter.endDate, 'MMM d, yyyy')}`;
    }
    
    return 'Custom Range';
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 py-2 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={14} />
        <span>{formatCurrentFilter()}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {predefinedRanges.map((range, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                onClick={() => applyFilter(range.range)}
                role="menuitem"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;