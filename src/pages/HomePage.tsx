import React from 'react';
import { usePokemon } from '../contexts/PokemonContext';
import PokemonGrid from '../components/PokemonGrid';
import TypeFilter from '../components/TypeFilter';
import SortControls from '../components/SortControl';
import Pagination from '../components/Pagination';
import ItemsPerPageSelector from '../components/ItemsPerPageSelect';

const HomePage: React.FC = () => {
  const { 
    pokemonList, 
    loading, 
    error, 
    totalCount, 
    currentPage, 
    itemsPerPage,
    setCurrentPage,
  } = usePokemon();
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  return (
    <div>
      <TypeFilter />
      <SortControls />
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          {!loading && !error && (
            <span>Showing {pokemonList.length} Pokemon</span>
          )}
        </div>
        <ItemsPerPageSelector />
      </div>
      
      <PokemonGrid 
        pokemonList={pokemonList}
        loading={loading}
        error={error}
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;