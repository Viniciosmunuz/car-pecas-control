
import React from 'react';
import { Layout } from '@/components/Layout';
import { Package, ShoppingCart, BarChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Dados fictícios para o dashboard
  const stats = {
    produtosTotal: 245,
    produtosBaixoEstoque: 18,
    vendasHoje: 12,
    vendasTotal: 3452,
    vendasValor: 24890.50,
    lucroMes: 8765.25
  };

  const featuredCards = [
    {
      title: 'Gestão de Estoque',
      description: 'Controle e gerencie seu estoque de peças automotivas com facilidade.',
      icon: <Package className="h-12 w-12 text-autoparts-blue" />,
      link: '/estoque',
      color: 'from-blue-50 to-indigo-100'
    },
    {
      title: 'Vendas e Comanda',
      description: 'Registre vendas com diferentes métodos de pagamento e emita comandas.',
      icon: <ShoppingCart className="h-12 w-12 text-autoparts-blue" />,
      link: '/vendas',
      color: 'from-emerald-50 to-teal-100'
    },
    {
      title: 'Controle Financeiro',
      description: 'Acompanhe receitas, despesas e lucros com relatórios detalhados.',
      icon: <BarChart className="h-12 w-12 text-autoparts-blue" />,
      link: '/financeiro',
      color: 'from-amber-50 to-yellow-100'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold text-autoparts-darkgray mb-4">
            Sistema de Gestão para Auto Peças
          </h1>
          <p className="text-lg text-gray-600">
            Controle seu estoque, gerencie vendas e monitore suas finanças em um único lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredCards.map((card, index) => (
            <Link 
              to={card.link} 
              key={index}
              className={`bg-gradient-to-br ${card.color} rounded-xl p-6 neomorphism hover-scale`}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold text-autoparts-darkgray mb-2">{card.title}</h2>
                <p className="text-gray-600 mb-6 flex-grow">{card.description}</p>
                <div className="flex items-center text-autoparts-blue">
                  <span className="font-medium">Acessar</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-autoparts-darkgray mb-4">Resumo Geral</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-autoparts-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Produtos em Estoque</h3>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-autoparts-darkgray">{stats.produtosTotal}</div>
                <div className="text-sm text-red-500">{stats.produtosBaixoEstoque} com estoque baixo</div>
              </div>
            </div>
            
            <div className="bg-autoparts-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Vendas de Hoje</h3>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-autoparts-darkgray">{stats.vendasHoje}</div>
                <div className="text-sm text-autoparts-blue">R$ {stats.vendasValor.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="bg-autoparts-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Lucro do Mês</h3>
              <div className="text-2xl font-bold text-green-600">R$ {stats.lucroMes.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
