import React from 'react';
import { PokemonDetails } from '../types/pokemon';
import TypeBadge from './TypeBadge';

interface PokemonCardProps {
  pokemon: PokemonDetails;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col">
      <div className="bg-gray-100 p-4 flex justify-center">
        <img 
          src={imageUrl} 
          alt={`${pokemon.name} sprite`} 
          className="h-32 w-32 object-contain" 
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold capitalize">{pokemon.name}</h2>
          <span className="text-sm font-medium text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {pokemon.types.map(typeInfo => (
            <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;