import { create } from "zustand";
import {
  supabase,
  Transaction,
  TransactionType,
  getTransactions,
} from "../lib/supabase";
import toast from "react-hot-toast";

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  dateFilter: DateFilter;

  // Fetch actions
  fetchTransactions: (type?: TransactionType) => Promise<void>;

  // CRUD actions
  addTransaction: (
    transaction: Omit<Transaction, "id" | "user_id" | "created_at">
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Filter actions
  setDateFilter: (filter: DateFilter) => void;

  // Stats
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  dateFilter: {
    startDate: null,
    endDate: null,
  },

  fetchTransactions: async (type) => {
    set({ isLoading: true });
    try {
      const { startDate, endDate } = get().dateFilter;
      const transactions = await getTransactions(
        type,
        startDate || undefined,
        endDate || undefined
      );
      set({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      set({ isLoading: false });
    }
  },

 addTransaction: async (transactionData) => {
  set({ isLoading: true });
  try {
    // Ambil user saat ini
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Gabungkan user_id ke dalam data transaksi
    const fullData = {
      ...transactionData,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(fullData)
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      transactions: [data as Transaction, ...state.transactions],
    }));

    toast.success(
      `${transactionData.type === "income" ? "Income" : "Expense"} added successfully`
    );
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    toast.error(error?.message || "Failed to add transaction");
  } finally {
    set({ isLoading: false });
  }
},


  deleteTransaction: async (id) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));

      toast.success("Transaction deleted");
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      const message = error?.message || "Failed to add transaction";
      toast.error(message);
    }
  },

  setDateFilter: (filter) => {
    set({ dateFilter: filter });
    // Fetch transactions with new filter
    get().fetchTransactions();
  },

  getTotalIncome: () => {
    return get()
      .transactions.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalExpenses: () => {
    return get()
      .transactions.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getBalance: () => {
    return get().getTotalIncome() - get().getTotalExpenses();
  },
}));
