
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategorySelector } from '@/components/CategorySelector';
import { ProductCard, Product } from '@/components/ProductCard';
import { AddProductForm } from '@/components/AddProductForm';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Dados iniciais de categorias
const initialCategories = [
  { id: 'motor', name: 'Motor' },
  { id: 'suspensao', name: 'Suspensão' },
  { id: 'freios', name: 'Freios' },
  { id: 'eletrica', name: 'Elétrica' },
  { id: 'lubrificantes', name: 'Lubrificantes' },
  { id: 'acessorios', name: 'Acessórios' },
];

// Produtos iniciais de exemplo
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Filtro de Óleo',
    description: 'Filtro de óleo para motores 1.0 a 2.0',
    price: 29.90,
    category: 'motor',
    stock: 25,
  },
  {
    id: '2',
    name: 'Pastilha de Freio',
    description: 'Jogo de pastilhas para freios a disco',
    price: 89.90,
    category: 'freios',
    stock: 15,
  },
  {
    id: '3',
    name: 'Óleo 5W30',
    description: 'Óleo sintético para motores modernos',
    price: 120.00,
    category: 'lubrificantes',
    stock: 30,
  },
  {
    id: '4',
    name: 'Amortecedor Dianteiro',
    description: 'Par de amortecedores para carros leves',
    price: 349.90,
    category: 'suspensao',
    stock: 8,
  },
  {
    id: '5',
    name: 'Bateria 60Ah',
    description: 'Bateria para carros com múltiplos acessórios',
    price: 389.90,
    category: 'eletrica',
    stock: 12,
  },
  {
    id: '6',
    name: 'Tapete de Borracha',
    description: 'Jogo de tapetes em borracha resistente',
    price: 79.90,
    category: 'acessorios',
    stock: 20,
  },
];

const Estoque = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // Carregar produtos do localStorage ou usar dados iniciais
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
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
  
  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsAddProductOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
  };
  
  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      // Atualizar produto existente
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...productData } 
          : product
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      toast({
        title: "Produto atualizado",
        description: "As informações do produto foram atualizadas com sucesso.",
      });
    } else {
      // Adicionar novo produto
      const newProduct: Product = {
        id: Date.now().toString(), // ID simples baseado em timestamp
        ...productData
      };
      
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      toast({
        title: "Produto adicionado",
        description: "O novo produto foi adicionado com sucesso.",
      });
    }
    
    setIsAddProductOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-autoparts-darkgray">Gerenciamento de Estoque</h1>
          
          <button
            onClick={handleAddProduct}
            className="flex items-center space-x-2 bg-autoparts-blue text-white px-4 py-2 rounded-lg hover:bg-autoparts-blue/90 transition-colors duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Produto</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-medium text-autoparts-darkgray mb-4">Filtros</h2>
            
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} placeholder="Buscar produtos..." />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias</h3>
              <CategorySelector
                categories={initialCategories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-autoparts-darkgray">
                  Produtos {selectedCategory && `- ${initialCategories.find(c => c.id === selectedCategory)?.name}`}
                </h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} produtos</span>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum produto encontrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isAddProductOpen && (
        <AddProductForm
          onClose={() => setIsAddProductOpen(false)}
          onSave={handleSaveProduct}
          editProduct={editingProduct}
          categories={initialCategories}
        />
      )}
    </Layout>
  );
};

export default Estoque;
