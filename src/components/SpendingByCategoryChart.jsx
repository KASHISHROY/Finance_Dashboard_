import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import useFinanceStore from '../stores/useFinanceStore';
import { formatCurrency } from '../utils/helpers';

const SpendingByCategoryChart = () => {
  const { getExpensesByCategory } = useFinanceStore();
  const expenses = getExpensesByCategory();

  const colors = ['#0284c7', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed', '#ec4899', '#06b6d4'];

  const data = Object.entries(expenses)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-80">
        <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingByCategoryChart;