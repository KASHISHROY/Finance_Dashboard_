import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Wallet } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';
import StatCard from './StatCard';
import BalanceTrendChart from './BalanceTrendChart';
import SpendingByCategoryChart from './SpendingByCategoryChart';
import TransactionList from './TransactionList';
import Insights from './Insights';
import BudgetManager from './BudgetManager';
import Goals from './Goals';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const {
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getSavingsRate,
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Summary Cards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Financial Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Balance"
                  value={getBalance()}
                  icon={Wallet}
                  color="primary"
                />
                <StatCard
                  title="Total Income"
                  value={getTotalIncome()}
                  icon={TrendingUp}
                  color="success"
                />
                <StatCard
                  title="Total Expenses"
                  value={getTotalExpenses()}
                  icon={BarChart3}
                  color="danger"
                />
                <StatCard
                  title="Savings Rate"
                  value={`${getSavingsRate()}%`}
                  icon={Target}
                  color="warning"
                />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceTrendChart />
              <SpendingByCategoryChart />
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in">
            <TransactionList />
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="animate-fade-in">
            <Insights />
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="animate-fade-in">
            <BudgetManager />
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="animate-fade-in">
            <Goals />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;