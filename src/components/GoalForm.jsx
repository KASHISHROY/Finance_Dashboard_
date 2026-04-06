import React, { useState } from 'react';
import { X } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';

const GoalForm = ({ goal = null, onClose }) => {
  const { addGoal, updateGoal } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    target: goal?.target || '',
    current: goal?.current || '',
    category: goal?.category || 'Savings',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Goal name is required';
    if (!formData.target || isNaN(formData.target) || formData.target <= 0) newErrors.target = 'Valid target amount is required';
    if (!formData.current || isNaN(formData.current) || formData.current < 0) newErrors.current = 'Valid current amount is required';
    if (parseInt(formData.current) > parseInt(formData.target)) newErrors.current = 'Current amount cannot exceed target';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const goalData = {
      name: formData.name,
      target: parseInt(formData.target),
      current: parseInt(formData.current),
      category: formData.category,
    };

    if (goal) {
      updateGoal(goal.id, goalData);
    } else {
      addGoal(goalData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{goal ? 'Edit Goal' : 'Add New Goal'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal Name</label>
            <input type="text" name="name" placeholder="e.g., Emergency Fund" value={formData.name} onChange={handleChange} className="input" />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Amount (₹)</label>
            <input type="number" name="target" placeholder="0" value={formData.target} onChange={handleChange} className="input" min="0" />
            {errors.target && <p className="text-red-600 text-sm mt-1">{errors.target}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Amount (₹)</label>
            <input type="number" name="current" placeholder="0" value={formData.current} onChange={handleChange} className="input" min="0" />
            {errors.current && <p className="text-red-600 text-sm mt-1">{errors.current}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn btn-primary">
              {goal ? 'Update' : 'Add'} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;