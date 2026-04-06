import React, { useState } from 'react';
import { Search, Filter, Download, Edit2, Trash2, Plus } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';
import { formatCurrency, formatDate, getCategoryColor, sortTransactions } from '../utils/Helpers';
import TransactionForm from './TransactionForm';

// Export to CSV
const exportToCSV = (transactions) => {
  const headers = ['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Description'];
  const rows = transactions.map((t) => [
    t.date,
    t.merchant,
    t.category,
    t.type,
    t.amount,
    t.description,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Export to JSON
const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const TransactionList = () => {
  const { transactions, filters, setFilters, clearFilters, deleteTransaction, role, getFilteredTransactions } = useFinanceStore();
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = getFilteredTransactions();
  const sortedTransactions = sortTransactions(filteredTransactions, sortBy, sortOrder);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
        {role === 'admin' && (
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="card space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                className="input !pl-10"
              />
            </div>
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filters
          </button>

          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>

          {/* DOWNLOAD BUTTONS */}
          <button 
            onClick={() => exportToCSV(sortedTransactions)}
            className="btn btn-secondary flex items-center gap-2"
            title="Download as CSV"
          >
            <Download size={18} />
            CSV
          </button>

          <button 
            onClick={() => exportToJSON(sortedTransactions)}
            className="btn btn-secondary flex items-center gap-2"
            title="Download as JSON"
          >
            <Download size={18} />
            JSON
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ category: e.target.value || null })}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Salary">Salary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ type: e.target.value || null })}
                className="input"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ startDate: e.target.value || null })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ endDate: e.target.value || null })}
                className="input"
              />
            </div>
          </div>
        )}
      </div>

      {/* SORT CONTROLS */}
      <div className="card flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input py-2 text-sm flex-1 max-w-xs"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="btn btn-secondary text-sm py-2"
        >
          {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
          {sortedTransactions.length} of {transactions.length}
        </span>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="card overflow-x-auto">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Merchant</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                {role === 'admin' && (
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(transaction.date)}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{transaction.merchant}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getCategoryColor(transaction.category)}`}>{transaction.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-sm font-semibold text-right ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this transaction?')) {
                            deleteTransaction(transaction.id);
                          }
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 inline-flex"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* TRANSACTION FORM MODAL */}
      {(showAddForm || editingTransaction) && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => {
            setShowAddForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionList;