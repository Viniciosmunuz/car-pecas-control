
import React, { useState } from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from './ProductCard';
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

interface SaleFormProps {
  cartItems: CartItem[];
  onClose: () => void;
  onCompleteSale: (saleData: SaleData) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

interface SaleData {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  customerName: string;
  customerPhone?: string;
  date: Date;
}

export const SaleForm: React.FC<SaleFormProps> = ({
  cartItems,
  onClose,
  onCompleteSale,
  onRemoveItem,
  onUpdateQuantity
}) => {
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao carrinho",
        variant: "destructive"
      });
      return;
    }
    
    if (!customerName) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    const saleData: SaleData = {
      items: cartItems,
      total,
      paymentMethod,
      customerName,
      customerPhone,
      date: new Date()
    };
    
    onCompleteSale(saleData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 shadow-xl animate-slide-up max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-autoparts-blue" />
            <h2 className="text-xl font-semibold text-autoparts-darkgray">Finalizar Venda</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-3">Itens no Carrinho</h3>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum item no carrinho</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500">R$ {item.price.toFixed(2)} × {item.quantity}</span>
                          <span className="font-medium">R$ {item.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            type="button"
                            onClick={() => item.quantity > 1 && onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-autoparts-blue">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Informações da Venda</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transferência Bancária</option>
                  </select>
                </div>
                
                <div className="pt-4 mt-8">
                  <button
                    type="submit"
                    className="w-full py-3 bg-autoparts-blue text-white rounded-md hover:bg-autoparts-blue/90 transition-colors font-medium"
                  >
                    Finalizar Venda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
