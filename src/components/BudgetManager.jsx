import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';
import { formatCurrency } from '../utils/helpers';

const BudgetManager = () => {
  const { budgets, setBudget, getBudgetStatus } = useFinanceStore();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const budgetStatus = getBudgetStatus();

  const handleEdit = (category, amount) => {
    setEditingCategory(category);
    setEditValue(amount.toString());
  };

  const handleSave = (category) => {
    const amount = parseInt(editValue);
    if (amount > 0) {
      setBudget(category, amount);
      setEditingCategory(null);
    }
  };

  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Budget Management</h2>
        <p className="text-gray-600 dark:text-gray-400">Set and track budgets for each spending category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const status = budgetStatus.find((b) => b.category === category);
          if (!status) return null;

          const isOver = status.spent > status.budget;
          const isWarning = status.spent > status.budget * 0.8;

          return (
            <div key={category} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
                {editingCategory !== category && (
                  <button onClick={() => handleEdit(category, status.budget)} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" title="Edit budget">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {editingCategory === category ? (
                <div className="space-y-3">
                  <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="input flex-1" min="0" placeholder="Enter budget" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(category)} className="flex-1 btn btn-primary flex items-center justify-center gap-2 py-2">
                      <Save size={16} />
                      Save
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="flex-1 btn btn-secondary flex items-center justify-center gap-2 py-2">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Budget:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(status.budget)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Spent:</span>
                    <span className={`font-semibold ${isOver ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{formatCurrency(status.spent)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Remaining:</span>
                    <span className={`font-semibold ${isOver ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatCurrency(Math.max(0, status.remaining))}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted">Progress</span>
                      <span className={`text-xs font-semibold ${status.percentage > 100 ? 'text-red-600 dark:text-red-400' : status.percentage > 80 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                        {status.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${status.percentage > 100 ? 'bg-red-600' : status.percentage > 80 ? 'bg-amber-600' : 'bg-green-600'}`}
                        style={{ width: `${Math.min(status.percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {isOver && <div className="p-2 bg-red-50 dark:bg-red-900 rounded text-xs text-red-800 dark:text-red-200">
                    Over budget by {formatCurrency(status.spent - status.budget)}
                  </div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;