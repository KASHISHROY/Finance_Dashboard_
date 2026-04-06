import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';
import { formatCurrency } from '../utils/helpers';
import GoalForm from './GoalForm';

const Goals = () => {
  const { goals, deleteGoal, role } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const getGoalProgress = (goal) => {
    return Math.round((goal.current / goal.target) * 100);
  };

  const getRemainingAmount = (goal) => {
    return Math.max(0, goal.target - goal.current);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Goals</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Track your savings goals and targets</p>
        </div>
        {role === 'admin' && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Goal
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No goals set yet</p>
          {role === 'admin' && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary mx-auto">
              Create Your First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                {role === 'admin' && (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingGoal(goal)} className="text-blue-600 dark:text-blue-400 hover:text-blue-700" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { if (confirm('Delete this goal?')) deleteGoal(goal.id); }} className="text-red-600 dark:text-red-400 hover:text-red-700" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Target:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.target)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Current:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(goal.current)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Remaining:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(getRemainingAmount(goal))}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted">Progress</span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{getGoalProgress(goal)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${getGoalProgress(goal)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingGoal) && (
        <GoalForm goal={editingGoal} onClose={() => { setShowForm(false); setEditingGoal(null); }} />
      )}
    </div>
  );
};

export default Goals;