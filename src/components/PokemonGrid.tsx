import React from 'react';
import { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface PokemonGridProps {
  pokemonList: Pokemon[];
  loading: boolean;
  error: string | null;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemonList, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md inline-block">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md inline-block">
          <p>No Pokémon found. Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemonList.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonGrid;