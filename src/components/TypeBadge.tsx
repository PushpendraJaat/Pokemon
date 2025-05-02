import React from 'react';
import { PokemonType } from '../types/pokemon';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => {
  const typeColors: Record<PokemonType, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span 
      className={`${typeColors[type]} ${sizeClasses[size]} text-white rounded-full inline-block capitalize font-medium`}
    >
      {type}
    </span>
  );
};

export default TypeBadge;