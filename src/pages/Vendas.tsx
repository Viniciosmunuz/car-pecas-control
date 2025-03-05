
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategorySelector } from '@/components/CategorySelector';
import { ProductCard, Product } from '@/components/ProductCard';
import { SaleForm } from '@/components/SaleForm';
import { ShoppingCart, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Interface para itens no carrinho
interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

// Interface para registro de venda
export interface Sale {
  id: string;
  date: Date;
  customerName: string;
  customerPhone?: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
}

const Vendas = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  
  // Carregar produtos do localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    // Extrair categorias únicas dos produtos
    if (savedProducts) {
      const productsData = JSON.parse(savedProducts) as Product[];
      const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
      
      // Dados fictícios das categorias - em uma aplicação real isso viria do banco de dados
      const categoriesData = [
        { id: 'motor', name: 'Motor' },
        { id: 'suspensao', name: 'Suspensão' },
        { id: 'freios', name: 'Freios' },
        { id: 'eletrica', name: 'Elétrica' },
        { id: 'lubrificantes', name: 'Lubrificantes' },
        { id: 'acessorios', name: 'Acessórios' },
      ];
      
      setCategories(categoriesData.filter(c => uniqueCategories.includes(c.id)));
    }
    
    // Carregar vendas anteriores
    const savedSales = localStorage.getItem('sales');
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);
  
  // Filtrar produtos baseado na categoria e termo de busca
  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  const handleAddToCart = (product: Product) => {
    // Verificar se o produto já está no carrinho
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Atualizar quantidade se já existir
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].subtotal = updatedCart[existingItemIndex].quantity * product.price;
      setCart(updatedCart);
    } else {
      // Adicionar novo item ao carrinho
      setCart([
        ...cart, 
        { 
          ...product, 
          quantity: 1, 
          subtotal: product.price 
        }
      ]);
    }
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} adicionado ao carrinho.`,
    });
  };
  
  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };
  
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.price
        };
      }
      return item;
    });
    
    setCart(updatedCart);
  };
  
  const handleCompleteSale = (saleData: any) => {
    // Criar registro de venda
    const newSale: Sale = {
      id: Date.now().toString(),
      date: new Date(),
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      paymentMethod: saleData.paymentMethod,
      items: [...cart],
      total: saleData.total
    };
    
    // Atualizar lista de vendas
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    
    // Atualizar estoque
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Limpar carrinho e fechar formulário
    setCart([]);
    setIsSaleFormOpen(false);
    
    // Notificar conclusão
    toast({
      title: "Venda realizada",
      description: `Venda para ${saleData.customerName} concluída com sucesso.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-autoparts-darkgray">Vendas</h1>
          
          <button
            onClick={() => setIsSaleFormOpen(true)}
            disabled={cart.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
              cart.length > 0
                ? 'bg-autoparts-blue text-white hover:bg-autoparts-blue/90'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Carrinho ({cart.length})</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-medium text-autoparts-darkgray mb-4">Filtros</h2>
            
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} placeholder="Buscar produtos..." />
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias</h3>
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-autoparts-darkgray mb-3">Carrinho</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Carrinho vazio</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex space-x-2 text-sm text-gray-500">
                            <span>{item.quantity}×</span>
                            <span>R$ {item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <span className="font-medium">R$ {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-semibold text-autoparts-blue">
                        R$ {cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setIsSaleFormOpen(true)}
                      className="w-full py-2 bg-autoparts-blue text-white rounded-md hover:bg-autoparts-blue/90 transition-colors"
                    >
                      Finalizar Venda
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-autoparts-darkgray">
                  Produtos Disponíveis
                </h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} produtos</span>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum produto encontrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts
                    .filter(product => product.stock > 0) // Mostrar apenas produtos em estoque
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onAddToCart={handleAddToCart}
                        view="sales"
                      />
                    ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-autoparts-blue" />
                <h2 className="text-lg font-medium text-autoparts-darkgray">Últimas Vendas</h2>
              </div>
              
              {sales.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma venda registrada.</p>
                </div>
              ) : (
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
                      {sales.slice(0, 5).map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(sale.date).toLocaleDateString('pt-BR')}
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
                            {sale.items.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-autoparts-blue">
                            R$ {sale.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isSaleFormOpen && (
        <SaleForm
          cartItems={cart}
          onClose={() => setIsSaleFormOpen(false)}
          onCompleteSale={handleCompleteSale}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </Layout>
  );
};

export default Vendas;
