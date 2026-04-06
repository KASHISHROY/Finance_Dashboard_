import React, { useState } from 'react';
import { X } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';

const TransactionForm = ({ transaction = null, onClose }) => {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    merchant: transaction?.merchant || '',
    category: transaction?.category || 'Food & Dining',
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    recurring: transaction?.recurring || false,
  });

  const [errors, setErrors] = useState({});
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Salary'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.merchant.trim()) newErrors.merchant = 'Merchant is required';
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const transactionData = { ...formData, amount: parseInt(formData.amount) };
    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="input" />
            {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Merchant / Description</label>
            <input type="text" name="merchant" placeholder="e.g., Starbucks" value={formData.merchant} onChange={handleChange} className="input" />
            {errors.merchant && <p className="text-red-600 text-sm mt-1">{errors.merchant}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input">
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="input">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
            <input type="number" name="amount" placeholder="0" value={formData.amount} onChange={handleChange} className="input" min="0" />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="recurring" id="recurring" checked={formData.recurring} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
            <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Mark as recurring
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn btn-primary">
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;