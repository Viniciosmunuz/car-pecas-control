
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { FinancialReport, Sale, Expense } from '@/components/FinancialReport';
import { PlusCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Categorias de despesas
const expenseCategories = [
  'Aluguel',
  'Salários',
  'Impostos',
  'Fornecedores',
  'Manutenção',
  'Água/Luz/Internet',
  'Marketing',
  'Outros'
];

const Financeiro = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(1))); // Primeiro dia do mês atual
  const [endDate, setEndDate] = useState(new Date()); // Hoje
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'date'>>({
    amount: 0,
    description: '',
    category: expenseCategories[0]
  });
  
  // Carregar dados de vendas e despesas
  useEffect(() => {
    const savedSales = localStorage.getItem('sales');
    if (savedSales) {
      // Converter string de data para objeto Date
      const parsedSales = JSON.parse(savedSales, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setSales(parsedSales);
    }
    
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      // Converter string de data para objeto Date
      const parsedExpenses = JSON.parse(savedExpenses, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setExpenses(parsedExpenses);
    } else {
      // Exemplo de despesas para demonstração
      const demoExpenses: Expense[] = [
        {
          id: '1',
          date: new Date(new Date().setDate(new Date().getDate() - 5)),
          amount: 2500,
          description: 'Aluguel mensal',
          category: 'Aluguel'
        },
        {
          id: '2',
          date: new Date(new Date().setDate(new Date().getDate() - 3)),
          amount: 450,
          description: 'Conta de luz',
          category: 'Água/Luz/Internet'
        },
        {
          id: '3',
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
          amount: 1850,
          description: 'Reposição de estoque',
          category: 'Fornecedores'
        }
      ];
      
      setExpenses(demoExpenses);
      localStorage.setItem('expenses', JSON.stringify(demoExpenses));
    }
  }, []);
  
  // Filtrar vendas e despesas pelo período selecionado
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
  
  const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };
  
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };
  
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newExpense.amount <= 0) {
      toast({
        title: "Erro",
        description: "O valor da despesa deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newExpense.description.trim()) {
      toast({
        title: "Erro",
        description: "A descrição da despesa é obrigatória.",
        variant: "destructive"
      });
      return;
    }
    
    const expense: Expense = {
      id: Date.now().toString(),
      date: new Date(),
      ...newExpense
    };
    
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    // Resetar formulário
    setNewExpense({
      amount: 0,
      description: '',
      category: expenseCategories[0]
    });
    setShowExpenseForm(false);
    
    toast({
      title: "Despesa registrada",
      description: "A despesa foi registrada com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-autoparts-darkgray flex items-center">
            <DollarSign className="h-6 w-6 mr-2" />
            Controle Financeiro
          </h1>
          
          <button
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center space-x-2 bg-autoparts-blue text-white px-4 py-2 rounded-lg hover:bg-autoparts-blue/90 transition-colors duration-300"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Registrar Despesa</span>
          </button>
        </div>
        
        <FinancialReport
          sales={filteredSales}
          expenses={filteredExpenses}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>
      
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-autoparts-darkgray flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
                Registrar Despesa
              </h2>
              <button 
                onClick={() => setShowExpenseForm(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddExpense}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleExpenseChange}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    name="category"
                    value={newExpense.category}
                    onChange={handleExpenseChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50"
                  >
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    name="description"
                    value={newExpense.description}
                    onChange={handleExpenseChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowExpenseForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-autoparts-blue text-white rounded-md hover:bg-autoparts-blue/90 transition-colors"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Financeiro;
