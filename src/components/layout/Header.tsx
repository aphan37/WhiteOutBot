import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, LogOut, Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow py-3 px-4 md:px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Whiteout Survival Web Companion</h1>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200" />
          ) : (
            <Moon size={20} className="text-gray-600 hover:text-gray-800" />
          )}
        </button>
        
        <div className="flex items-center">
          <span className="hidden md:block mr-2 text-sm">
            Character ID: {user?.characterId}
          </span>
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
            <User size={18} className="text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        
        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={20} className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;