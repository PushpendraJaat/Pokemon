import React from 'react';
import Header from './components/Header';
import PokemonGrid from './components/PokemonGrid';
import TypeFilter from './components/TypeFilter';
import Pagination from './components/Pagination';
import { usePokemon } from './hooks/usePokemon';
import Footer from './components/Footer';

function App() {
  const {
    pokemon,
    totalPokemon,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages
  } = usePokemon();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      <main className="container mx-auto sm:px-16 px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isLoading 
                ? 'Loading Pokemon...' 
                : `Showing ${pokemon.length} of ${totalPokemon} Pokemon`
              }
            </h2>
            
            <TypeFilter 
              selectedType={selectedType} 
              onTypeChange={setSelectedType} 
            />
          </div>
        </div>
        
        <PokemonGrid 
          pokemon={pokemon} 
          isLoading={isLoading} 
          error={error} 
        />

        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;