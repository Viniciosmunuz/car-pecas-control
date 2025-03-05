
import React from 'react';
import { Edit, Trash2, PlusCircle, MinusCircle } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  view?: 'stock' | 'sales';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onAddToCart,
  view = 'stock'
}) => {
  return (
    <div className="neomorphism overflow-hidden hover-scale">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-autoparts-darkgray truncate">{product.name}</h3>
          {view === 'stock' ? (
            <div className="flex space-x-1">
              <button 
                onClick={() => onEdit(product)} 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit className="h-4 w-4 text-autoparts-blue" />
              </button>
              <button 
                onClick={() => onDelete(product.id)} 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ) : null}
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-autoparts-blue">
            R$ {product.price.toFixed(2)}
          </span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.stock > 10 
              ? 'bg-green-100 text-green-800' 
              : product.stock > 0 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {product.stock} un
          </span>
        </div>
        
        {view === 'sales' && onAddToCart && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center space-x-1 bg-autoparts-blue text-white px-3 py-2 rounded-md hover:bg-autoparts-blue/90 transition-colors duration-300 text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
