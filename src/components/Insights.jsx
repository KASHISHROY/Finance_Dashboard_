import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, RotateCw, Target } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';
import { formatCurrency } from '../utils/helpers';

const Insights = () => {
  const { getSmartInsights, getTopCategories, getBalance, getTotalIncome, getTotalExpenses, getBudgetStatus } = useFinanceStore();
  const insights = getSmartInsights();
  const topCategories = getTopCategories(3);
  const budgetStatus = getBudgetStatus();
  const overBudgetCategories = budgetStatus.filter((b) => b.spent > b.budget);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'top-category':
        return <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />;
      case 'expense-increase':
        return <AlertCircle className="text-red-600 dark:text-red-400" size={20} />;
      case 'expense-decrease':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={20} />;
      case 'recurring':
        return <RotateCw className="text-amber-600 dark:text-amber-400" size={20} />;
      default:
        return <Target size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.length === 0 ? (
          <div className="col-span-full card text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No insights available yet</p>
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="card flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">{getInsightIcon(insight.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget Overview</h3>
        <div className="space-y-4">
          {budgetStatus.map((status) => (
            <div key={status.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status.category}</span>
                <span className={`text-sm font-semibold ${status.percentage > 100 ? 'text-red-600 dark:text-red-400' : status.percentage > 80 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                  {status.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${status.percentage > 100 ? 'bg-red-600' : status.percentage > 80 ? 'bg-amber-600' : 'bg-green-600'}`}
                  style={{ width: `${Math.min(status.percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Spent: {formatCurrency(status.spent)}</span>
                <span>Budget: {formatCurrency(status.budget)}</span>
              </div>
            </div>
          ))}
        </div>

        {overBudgetCategories.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ⚠️ {overBudgetCategories.length} categor{overBudgetCategories.length > 1 ? 'ies' : 'y'} over budget
            </p>
          </div>
        )}
      </div>

      {topCategories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
          <div className="space-y-3">
            {topCategories.map((category, idx) => {
              const total = topCategories.reduce((sum, c) => sum + c.amount, 0);
              const percentage = (category.amount / total) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.category}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-muted text-sm mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(getTotalIncome())}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted text-sm mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(getTotalExpenses())}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted text-sm mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(getBalance())}</p>
        </div>
      </div>
    </div>
  );
};

export default Insights;