import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import TypeBadge from '../components/TypeBadge';
import { useFavorites } from '../contexts/FavoritesContext';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon);
    }
  };

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <div className="relative">
          <img 
            src={pokemon.imageUrl || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'} 
            alt={pokemon.name}
            className="w-full h-48 object-contain bg-gray-100 p-4"
            loading="lazy"
          />
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              className={favorite ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
            <span className="text-gray-500 font-medium">#{pokemon.id}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map(type => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;