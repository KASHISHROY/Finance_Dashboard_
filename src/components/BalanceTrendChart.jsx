import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useFinanceStore from '../stores/useFinanceStore';
import { formatCurrency } from '../utils/helpers';

const BalanceTrendChart = () => {
  const { getMonthlyData } = useFinanceStore();
  const monthlyData = getMonthlyData();

  const data = Object.entries(monthlyData).map(([month, data]) => ({
    month: month.split(' ')[0],
    balance: data.balance,
    income: data.income,
    expense: data.expense,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.month}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">Balance: {formatCurrency(data.balance)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Balance Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="month" stroke="currentColor" style={{ fontSize: '12px', opacity: 0.7 }} />
          <YAxis stroke="currentColor" style={{ fontSize: '12px', opacity: 0.7 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="balance" stroke="#0284c7" dot={{ fill: '#0284c7', r: 4 }} activeDot={{ r: 6 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceTrendChart;