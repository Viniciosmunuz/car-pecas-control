
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl font-bold text-autoparts-darkgray mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        <Link 
          to="/" 
          className="flex items-center space-x-2 bg-autoparts-blue text-white px-4 py-2 rounded-lg hover:bg-autoparts-blue/90 transition-colors duration-300"
        >
          <Home className="h-5 w-5" />
          <span>Voltar para o Início</span>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
