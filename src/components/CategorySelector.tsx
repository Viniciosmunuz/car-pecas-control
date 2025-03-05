
import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelect
}) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
        ${
          selectedCategory === null
            ? 'bg-autoparts-blue text-white'
            : 'bg-white text-autoparts-darkgray hover:bg-autoparts-lightblue/20'
        }`}
      >
        Todas
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
          ${
            selectedCategory === category.id
              ? 'bg-autoparts-blue text-white'
              : 'bg-white text-autoparts-darkgray hover:bg-autoparts-lightblue/20'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
