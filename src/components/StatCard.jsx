import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/Helpers';

const StatCard = ({ title, value, icon: Icon, trend = null, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    success: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400',
    danger: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400',
    warning: 'bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-sm text-muted mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? formatCurrency(value) : value}
      </p>
    </div>
  );
};

export default StatCard;