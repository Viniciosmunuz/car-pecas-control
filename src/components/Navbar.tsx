
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, BarChart, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Início', icon: <Home className="h-5 w-5" /> },
    { path: '/estoque', label: 'Estoque', icon: <Package className="h-5 w-5" /> },
    { path: '/vendas', label: 'Vendas', icon: <ShoppingCart className="h-5 w-5" /> },
    { path: '/financeiro', label: 'Financeiro', icon: <BarChart className="h-5 w-5" /> }
  ];

  return (
    <header className="w-full bg-white shadow-md z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-autoparts-blue rounded-md flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-autoparts-darkgray">AutoPeças</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-autoparts-blue font-medium'
                    : 'text-autoparts-darkgray hover:text-autoparts-blue'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Menu mobile */}
          <div className="md:hidden flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'text-autoparts-blue'
                    : 'text-autoparts-darkgray'
                }`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
