import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import PokemonGrid from '../components/PokemonGrid';

const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();

  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
        <Link to="/" className="text-blue-600 hover:underline flex items-center mr-3">
            <ArrowLeft size={20} className="mr-1" />
            Back to list
          </Link>
          <h1 className="text-3xl font-bold">My Favorites</h1>
        </div>
        
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center"
          >
            <Heart size={16} className="mr-1" />
            Clear all
          </button>
        )}
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Heart size={64} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">You haven't added any Pokemon to your favorites.</p>
          <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Explore Pokemon
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">You have {favorites.length} favorite Pokemon</p>
          </div>
          
          <PokemonGrid 
            pokemonList={favorites}
            loading={false}
            error={null}
          />
        </>
      )}
      
    </div>
  );
};

export default FavoritesPage;