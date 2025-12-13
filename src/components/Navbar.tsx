import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, BarChart, Home, Wrench } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Início', icon: <Home className="h-5 w-5" /> },
    { path: '/estoque', label: 'Estoque', icon: <Package className="h-5 w-5" /> },
    { path: '/vendas', label: 'Vendas', icon: <ShoppingCart className="h-5 w-5" /> },
    { path: '/financeiro', label: 'Financeiro', icon: <BarChart className="h-5 w-5" /> }
  ];

  return (
    <header className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-lg z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">Auto Peças</span>
              <span className="text-xs text-white/80 font-medium tracking-wide">Nova Opção</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white font-medium backdrop-blur-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Menu mobile */}
          <div className="md:hidden flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
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
