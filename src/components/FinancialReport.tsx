
import React, { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

// Tipo para uma venda registrada
export interface Sale {
  id: string;
  date: Date;
  total: number;
  paymentMethod: string;
  customerName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}

// Tipo para uma despesa registrada
export interface Expense {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
}

interface FinancialReportProps {
  sales: Sale[];
  expenses: Expense[];
  startDate: Date;
  endDate: Date;
  onDateChange: (startDate: Date, endDate: Date) => void;
}

export const FinancialReport: React.FC<FinancialReportProps> = ({
  sales,
  expenses,
  startDate,
  endDate,
  onDateChange
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sales' | 'expenses'>('overview');
  
  // Calcular totais
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalSales - totalExpenses;
  
  // Dados para o gráfico de vendas vs despesas
  const salesByDay = new Map<string, number>();
  const expensesByDay = new Map<string, number>();
  
  // Processar vendas por dia
  sales.forEach(sale => {
    const dateStr = format(new Date(sale.date), 'dd/MM');
    const current = salesByDay.get(dateStr) || 0;
    salesByDay.set(dateStr, current + sale.total);
  });
  
  // Processar despesas por dia
  expenses.forEach(expense => {
    const dateStr = format(new Date(expense.date), 'dd/MM');
    const current = expensesByDay.get(dateStr) || 0;
    expensesByDay.set(dateStr, current + expense.amount);
  });
  
  // Combinar os dados para o gráfico
  const chartData = Array.from(new Set([...salesByDay.keys(), ...expensesByDay.keys()]))
    .sort((a, b) => {
      const [dayA, monthA] = a.split('/').map(Number);
      const [dayB, monthB] = b.split('/').map(Number);
      return (monthA - monthB) || (dayA - dayB);
    })
    .map(date => ({
      date,
      vendas: salesByDay.get(date) || 0,
      despesas: expensesByDay.get(date) || 0,
      lucro: (salesByDay.get(date) || 0) - (expensesByDay.get(date) || 0)
    }));
  
  // Dados para o gráfico de métodos de pagamento
  const paymentMethods = sales.reduce((acc, sale) => {
    const method = sale.paymentMethod;
    acc[method] = (acc[method] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);
  
  const paymentMethodsData = Object.entries(paymentMethods).map(([name, value]) => ({
    name: name
      .replace('dinheiro', 'Dinheiro')
      .replace('cartao_credito', 'Cartão de Crédito')
      .replace('cartao_debito', 'Cartão de Débito')
      .replace('pix', 'PIX')
      .replace('boleto', 'Boleto')
      .replace('transferencia', 'Transferência'),
    value
  }));
  
  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-autoparts-darkgray flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Relatório Financeiro
        </h2>
        
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">De:</label>
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => onDateChange(new Date(e.target.value), endDate)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Até:</label>
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => onDateChange(startDate, new Date(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vendas Totais</p>
              <p className="text-2xl font-bold text-autoparts-blue">R$ {totalSales.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-autoparts-blue opacity-70" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Despesas Totais</p>
              <p className="text-2xl font-bold text-red-500">R$ {totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500 opacity-70" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                R$ {profit.toFixed(2)}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${profit >= 0 ? 'text-green-500' : 'text-red-500'} opacity-70`} />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'overview'
                  ? 'border-autoparts-blue text-autoparts-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setSelectedTab('sales')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'sales'
                  ? 'border-autoparts-blue text-autoparts-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendas
            </button>
            <button
              onClick={() => setSelectedTab('expenses')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'expenses'
                  ? 'border-autoparts-blue text-autoparts-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Despesas
            </button>
          </nav>
        </div>
        
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Vendas vs Despesas</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="vendas" stroke="#1E88E5" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="despesas" stroke="#FF5252" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="lucro" stroke="#4CAF50" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Métodos de Pagamento</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Vendas por Dia</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                      <Bar dataKey="vendas" fill="#1E88E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'sales' && (
          <div className="bg-white rounded-lg border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhuma venda registrada no período selecionado
                      </td>
                    </tr>
                  ) : (
                    sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(sale.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.paymentMethod
                            .replace('dinheiro', 'Dinheiro')
                            .replace('cartao_credito', 'Cartão de Crédito')
                            .replace('cartao_debito', 'Cartão de Débito')
                            .replace('pix', 'PIX')
                            .replace('boleto', 'Boleto')
                            .replace('transferencia', 'Transferência')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.items.length} {sale.items.length === 1 ? 'item' : 'itens'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-autoparts-blue">
                          R$ {sale.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {selectedTab === 'expenses' && (
          <div className="bg-white rounded-lg border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhuma despesa registrada no período selecionado
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500">
                          R$ {expense.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
