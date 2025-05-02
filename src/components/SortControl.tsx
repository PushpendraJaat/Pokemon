import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { usePokemon } from '../contexts/PokemonContext';

const SortControls: React.FC = () => {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = usePokemon();

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    
    return sortOrder === 'asc' ? 
      <ChevronUp size={16} className="text-blue-600" /> : 
      <ChevronDown size={16} className="text-blue-600" />;
  };

  return (
    <div className="flex flex-col sm:flex-row bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="mb-2 sm:mb-0 mr-4">
        <span className="font-medium text-gray-700">Sort by:</span>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => handleSortChange('id')}
          className={`flex items-center px-3 py-1 rounded-md ${
            sortBy === 'id' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>Number</span>
          {getSortIcon('id')}
        </button>
        
        <button
          onClick={() => handleSortChange('name')}
          className={`flex items-center px-3 py-1 rounded-md ${
            sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>Name</span>
          {getSortIcon('name')}
        </button>
      </div>
    </div>
  );
};

export default SortControls;