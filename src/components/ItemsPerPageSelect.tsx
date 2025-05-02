import React from 'react';
import { usePokemon } from '../contexts/PokemonContext';

const ItemsPerPageSelector: React.FC = () => {
  const { itemsPerPage, setItemsPerPage, setCurrentPage } = usePokemon();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="itemsPerPage" className="text-sm text-gray-700">Show:</label>
      <select
        id="itemsPerPage"
        value={itemsPerPage}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
};

export default ItemsPerPageSelector;