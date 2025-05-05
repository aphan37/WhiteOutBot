import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Gift, 
  Shield, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: <Home size={20} /> 
    },
    { 
      path: '/gift-codes', 
      name: 'Gift Codes', 
      icon: <Gift size={20} /> 
    }
  ];
  
  // Add admin link if user has admin privileges
  if (user?.adminLevel === 1) {
    navItems.push({ 
      path: '/admin', 
      name: 'Admin', 
      icon: <Shield size={20} /> 
    });
  }

  const NavItem: React.FC<{
    path: string;
    name: string;
    icon: React.ReactNode;
  }> = ({ path, name, icon }) => (
    <NavLink
      to={path}
      className={({ isActive }) => 
        `flex items-center py-3 px-4 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <span className="mr-3">{icon}</span>
      <span>{name}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 fixed md:sticky top-0 left-0 h-full z-10 transition-transform transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Whiteout Survival</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Web Companion</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.path} 
              path={item.path} 
              name={item.name} 
              icon={item.icon} 
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;