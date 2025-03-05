
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Pesquisar...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-autoparts-blue/50 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-autoparts-blue text-white px-2 py-1 rounded-md text-sm hover:bg-autoparts-blue/90 transition-colors duration-300"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};
