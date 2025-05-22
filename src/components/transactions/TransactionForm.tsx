import { useState, useEffect } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { DEFAULT_CATEGORIES, TransactionType } from '../../lib/supabase';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  type?: TransactionType;
}

const TransactionForm = ({ type = 'income' }: TransactionFormProps) => {
  const { addTransaction } = useTransactionStore();
  
  const [transactionType, setTransactionType] = useState<TransactionType>(type);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  // Reset form when type prop changes
  useEffect(() => {
    setTransactionType(type);
    setCategory('');
    setCustomCategory('');
    setAmount('');
    setDescription('');
  }, [type]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!category) {
      toast.error('Pilih Kategori');
      return;
    }
    
    if (category === 'custom' && !customCategory.trim()) {
      toast.error('Masukkan kategori');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Uang yang dimasukkan tidak valid');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create transaction object
      const transactionData = {
        type: transactionType,
        category: category === 'custom' ? customCategory.trim() : category,
        amount: parseFloat(amount),
        description: description.trim() || undefined
      };
      
      // Add transaction
      await addTransaction(transactionData);
      
      // Reset form
      setCategory('');
      setCustomCategory('');
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-lg font-semibold mb-2">
        Tambah {transactionType === 'income' ? 'Income' : 'Expense'}
      </h3>
      
      {/* Transaction Type */}
      <div className="form-group">
        <label className="label">Tipe Transaksi</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`py-2 px-4 rounded-lg border font-medium transition-all ${
              transactionType === 'income'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setTransactionType('income')}
          >
            Income
          </button>
          <button
            type="button"
            className={`py-2 px-4 rounded-lg border font-medium transition-all ${
              transactionType === 'expense'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setTransactionType('expense')}
          >
            Expense
          </button>
        </div>
      </div>
      
      {/* Category */}
      <div className="form-group">
        <label htmlFor="category" className="label">Kategori</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Pilih Kategori</option>
          {DEFAULT_CATEGORIES[transactionType].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="custom">Custom...</option>
        </select>
      </div>
      
      {/* Custom Category (shown only when 'custom' is selected) */}
      {category === 'custom' && (
        <div className="form-group">
          <label htmlFor="customCategory" className="label">Custom Category</label>
          <input
            type="text"
            id="customCategory"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="input-field"
            placeholder="Enter custom category"
            required
          />
        </div>
      )}
      
      {/* Amount */}
      <div className="form-group">
        <label htmlFor="amount" className="label">Jumlah</label>
        <div className="relative">
          <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-slate-500">Rp.</span>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field pl-8"
            placeholder="0000,0"
            step="1000"
            min="1000"
            required
          />
        </div>
      </div>
      
      {/* Description (optional) */}
      <div className="form-group">
        <label htmlFor="description" className="label">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field resize-none"
          rows={3}
          placeholder="Add a note about this transaction"
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary w-full flex items-center justify-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <>
            <PlusCircle size={18} />
            <span>Add {transactionType === 'income' ? 'Income' : 'Expense'}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default TransactionForm;