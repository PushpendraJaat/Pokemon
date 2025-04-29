import React from 'react';
import { PokemonType } from '../types/pokemon';

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const pokemonTypes: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 
  'ice', 'fighting', 'poison', 'ground', 'flying', 
  'psychic', 'bug', 'rock', 'ghost', 'dragon', 
  'dark', 'steel', 'fairy'
];

const TypeFilter: React.FC<TypeFilterProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="w-full md:w-48">
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="">All Types</option>
        {pokemonTypes.map(type => (
          <option key={type} value={type} className="capitalize">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;