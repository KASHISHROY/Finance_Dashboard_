import React from 'react';
import { Moon, Sun, User } from 'lucide-react';
import useFinanceStore from '../stores/useFinanceStore';

const Header = () => {
  const { theme, toggleTheme, role, setRole } = useFinanceStore();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FD</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceHub</h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Role Selector */}
            <div className="flex items-center gap-2">
              <User size={18} className="text-gray-600 dark:text-gray-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input py-1 text-sm !px-2 min-w-[120px]"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;