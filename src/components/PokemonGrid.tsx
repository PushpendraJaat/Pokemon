import React from 'react';
import { PokemonDetails } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonGridProps {
  pokemon: PokemonDetails[];
  isLoading: boolean;
  error: Error | null;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemon, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
        <p className="text-gray-600">Loading Pokemon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600 text-lg">No Pokemon found matching your search criteria.</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemon.map(p => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
};

export default PokemonGrid;