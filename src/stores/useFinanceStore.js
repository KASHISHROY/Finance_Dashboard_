import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate mock transaction data
const generateMockTransactions = () => {
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Salary'];
  const merchants = ['Starbucks', 'Uber', 'Amazon', 'Netflix', 'Electric Bill', 'Hospital', 'Company Salary', 'Zomato', 'Flipkart', 'Gym', 'Gas Station', 'Restaurant'];
  
  const transactions = [];
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const isExpense = Math.random() > 0.25;
    const category = isExpense ? categories[Math.floor(Math.random() * (categories.length - 1))] : 'Salary';
    const amount = isExpense ? Math.floor(Math.random() * 5000) + 100 : 50000;
    
    transactions.push({
      id: `txn_${i}`,
      date: date.toISOString().split('T')[0],
      amount: amount,
      category: category,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      type: isExpense ? 'expense' : 'income',
      description: `${isExpense ? 'Spent' : 'Received'} at ${merchants[Math.floor(Math.random() * merchants.length)]}`,
      recurring: Math.random() > 0.85,
    });
  }
  
  return transactions;
};

const useFinanceStore = create(
  persist(
    (set, get) => ({
      // State
      transactions: generateMockTransactions(),
      filters: {
        category: null,
        type: null,
        startDate: null,
        endDate: null,
        searchTerm: '',
        amountMin: 0,
        amountMax: 100000,
      },
      role: 'viewer',
      theme: 'light',
      budgets: {
        'Food & Dining': 10000,
        'Transportation': 5000,
        'Shopping': 15000,
        'Entertainment': 5000,
        'Utilities': 3000,
        'Healthcare': 2000,
      },
      goals: [
        { id: 'goal_1', name: 'Emergency Fund', target: 50000, current: 35000, category: 'Savings' },
        { id: 'goal_2', name: 'Vacation', target: 100000, current: 45000, category: 'Entertainment' },
      ],

      // Actions - Transaction Management
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [
            { ...transaction, id: `txn_${Date.now()}` },
            ...state.transactions,
          ],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      // Filter Management
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            category: null,
            type: null,
            startDate: null,
            endDate: null,
            searchTerm: '',
            amountMin: 0,
            amountMax: 100000,
          },
        });
      },

      // Role Management
      setRole: (role) => {
        set({ role });
      },

      // Theme Management
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      setTheme: (theme) => {
        set({ theme });
      },

      // Budget Management
      setBudget: (category, amount) => {
        set((state) => ({
          budgets: {
            ...state.budgets,
            [category]: amount,
          },
        }));
      },

      // Goal Management
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));
      },

      addGoal: (goal) => {
        set((state) => ({
          goals: [...state.goals, { ...goal, id: `goal_${Date.now()}` }],
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      // Selectors - Filtered Transactions
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        
        return transactions.filter((t) => {
          if (filters.category && t.category !== filters.category) return false;
          if (filters.type && t.type !== filters.type) return false;
          if (filters.startDate && new Date(t.date) < new Date(filters.startDate)) return false;
          if (filters.endDate && new Date(t.date) > new Date(filters.endDate)) return false;
          if (t.amount < filters.amountMin || t.amount > filters.amountMax) return false;
          if (
            filters.searchTerm &&
            !t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !t.merchant.toLowerCase().includes(filters.searchTerm.toLowerCase())
          ) {
            return false;
          }
          return true;
        });
      },

      // Selectors - Statistics
      getTotalIncome: () => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpenses: () => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        const income = get().getTotalIncome();
        const expenses = get().getTotalExpenses();
        return income - expenses;
      },

      getSavingsRate: () => {
        const income = get().getTotalIncome();
        if (income === 0) return 0;
        const balance = get().getBalance();
        return Math.round((balance / income) * 100);
      },

      getExpensesByCategory: () => {
        const { transactions } = get();
        const expenses = transactions.filter((t) => t.type === 'expense');
        const byCategory = {};
        
        expenses.forEach((t) => {
          byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
        });
        
        return byCategory;
      },

      getMonthlyData: () => {
        const { transactions } = get();
        const monthly = {};
        
        transactions.forEach((t) => {
          const month = new Date(t.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          });
          
          if (!monthly[month]) {
            monthly[month] = { income: 0, expense: 0, balance: 0 };
          }
          
          if (t.type === 'income') {
            monthly[month].income += t.amount;
          } else {
            monthly[month].expense += t.amount;
          }
          
          monthly[month].balance = monthly[month].income - monthly[month].expense;
        });
        
        return Object.keys(monthly)
          .reverse()
          .slice(0, 12)
          .reduce((acc, key) => {
            acc[key] = monthly[key];
            return acc;
          }, {});
      },

      getTopCategories: (limit = 5) => {
        const expenses = get().getExpensesByCategory();
        return Object.entries(expenses)
          .sort(([, a], [, b]) => b - a)
          .slice(0, limit)
          .map(([category, amount]) => ({ category, amount }));
      },

      getCategoryStats: (category) => {
        const { transactions } = get();
        const categoryTransactions = transactions.filter((t) => t.category === category);
        const expenses = categoryTransactions.filter((t) => t.type === 'expense');
        
        return {
          count: categoryTransactions.length,
          totalExpenses: expenses.reduce((sum, t) => sum + t.amount, 0),
          avgExpense: expenses.length > 0 ? Math.round(expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length) : 0,
          transactions: categoryTransactions,
        };
      },

      getBudgetStatus: () => {
        const { budgets } = get();
        const expenses = get().getExpensesByCategory();
        
        return Object.entries(budgets).map(([category, budget]) => ({
          category,
          budget,
          spent: expenses[category] || 0,
          remaining: budget - (expenses[category] || 0),
          percentage: Math.round(((expenses[category] || 0) / budget) * 100),
        }));
      },

      getRecurringTransactions: () => {
        const { transactions } = get();
        return transactions.filter((t) => t.recurring);
      },

      getSmartInsights: () => {
        const { transactions } = get();
        const topCategories = get().getTopCategories(1);
        const monthlyData = get().getMonthlyData();
        const monthlyArray = Object.values(monthlyData);
        
        const insights = [];
        
        if (topCategories.length > 0) {
          insights.push({
            type: 'top-category',
            title: 'Top Spending Category',
            description: `You spent the most on ${topCategories[0].category} (₹${topCategories[0].amount.toLocaleString()})`,
            icon: 'trending',
          });
        }
        
        if (monthlyArray.length >= 2) {
          const lastMonth = monthlyArray[monthlyArray.length - 1];
          const prevMonth = monthlyArray[monthlyArray.length - 2];
          const change = ((lastMonth.expense - prevMonth.expense) / prevMonth.expense) * 100;
          
          if (change > 10) {
            insights.push({
              type: 'expense-increase',
              title: 'Spending Alert',
              description: `Your expenses increased by ${Math.round(change)}% compared to last month`,
              icon: 'alert',
            });
          } else if (change < -10) {
            insights.push({
              type: 'expense-decrease',
              title: 'Great Job!',
              description: `You saved ${Math.round(Math.abs(change))}% by reducing expenses this month`,
              icon: 'success',
            });
          }
        }
        
        const recurringCount = get().getRecurringTransactions().length;
        if (recurringCount > 0) {
          insights.push({
            type: 'recurring',
            title: 'Recurring Transactions',
            description: `You have ${recurringCount} recurring transactions set up`,
            icon: 'recurring',
          });
        }
        
        return insights;
      },

      exportToCSV: (transactions, filename = 'transactions.csv') => {
        const headers = ['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Description'];
        const rows = transactions.map((t) => [
          t.date,
          t.merchant,
          t.category,
          t.type,
          t.amount,
          t.description,
        ]);

        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },

      exportToJSON: (transactions, filename = 'transactions.json') => {
        const json = JSON.stringify(transactions, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
    }),
    {
      name: 'finance-store',
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
        theme: state.theme,
      }),
    }
  )
);

export default useFinanceStore;