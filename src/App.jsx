import React, { useEffect } from 'react';
import useFinanceStore from './stores/useFinanceStore';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const { theme } = useFinanceStore();

  useEffect(() => {
    // Apply theme to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;