import React from 'react';
import { PokemonType } from '../types/pokemon';

interface TypeBadgeProps {
  type: string;
}

const typeColors: Record<PokemonType, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300'
};

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const bgColor = typeColors[type as PokemonType] || 'bg-gray-400';
  
  return (
    <span className={`${bgColor} text-white text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}>
      {type}
    </span>
  );
};

export default TypeBadge;