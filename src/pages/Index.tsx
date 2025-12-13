import React from 'react';
import { Layout } from '@/components/Layout';
import { Package, ShoppingCart, BarChart, ArrowRight, TrendingUp, AlertTriangle, DollarSign, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
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
      icon: <Package className="h-10 w-10" />,
      link: '/estoque',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Vendas e Comanda',
      description: 'Registre vendas com diferentes métodos de pagamento e emita comandas.',
      icon: <ShoppingCart className="h-10 w-10" />,
      link: '/vendas',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Controle Financeiro',
      description: 'Acompanhe receitas, despesas e lucros com relatórios detalhados.',
      icon: <BarChart className="h-10 w-10" />,
      link: '/financeiro',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Wrench className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Auto Peças Nova Opção</h1>
                <p className="text-white/80 text-sm">Sistema de Gestão Completo</p>
              </div>
            </div>
            <p className="text-lg text-white/90 mt-4">
              Controle seu estoque, gerencie vendas e monitore suas finanças em um único lugar.
            </p>
          </div>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCards.map((card, index) => (
            <Link 
              to={card.link} 
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold text-foreground group-hover:text-white mb-2 transition-colors">{card.title}</h2>
                <p className="text-muted-foreground group-hover:text-white/80 mb-4 transition-colors">{card.description}</p>
                <div className="flex items-center text-primary group-hover:text-white font-medium transition-colors">
                  <span>Acessar</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Produtos em Estoque</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.produtosTotal}</div>
            <p className="text-xs text-muted-foreground mt-1">itens cadastrados</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Estoque Baixo</span>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-destructive">{stats.produtosBaixoEstoque}</div>
            <p className="text-xs text-muted-foreground mt-1">produtos para repor</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Vendas Hoje</span>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.vendasHoje}</div>
            <p className="text-xs text-primary mt-1">R$ {stats.vendasValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Lucro do Mês</span>
              <div className="p-2 bg-amber-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-600">R$ {stats.lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">resultado positivo</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
