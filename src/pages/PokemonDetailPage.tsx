import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, GitCompare } from 'lucide-react';
import { usePokemon } from '../contexts/PokemonContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { PokemonDetails } from '../types/pokemon';
import TypeBadge from '../components/TypeBadge';
import PokemonStats from '../components/PokemonStats';
import PokemonEvolution from '../components/PokemonEvolution';
import LoadingSpinner from '../components/LoadingSpinner';

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchPokemonDetail } = usePokemon();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'evolution' | 'moves'>('about');
  
  useEffect(() => {
    const loadPokemon = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const details = await fetchPokemonDetail(id);
        if (details) {
          setPokemon(details);
          document.title = `PokéExplorer - ${details.name.charAt(0).toUpperCase() + details.name.slice(1)}`;
        } else {
          setError('Failed to load Pokémon details');
        }
      } catch (err) {
        setError('An error occurred while fetching Pokémon details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPokemon();
  }, [id, fetchPokemonDetail]);
  
  const handleFavoriteToggle = () => {
    if (!pokemon) return;
    
    const pokemonData = {
      id: pokemon.id.toString(),
      name: pokemon.name,
      imageUrl: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
      types: pokemon.types.map(t => t.type.name as any)
    };
    
    if (isFavorite(pokemon.id.toString())) {
      removeFavorite(pokemon.id.toString());
    } else {
      addFavorite(pokemonData);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !pokemon) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-md inline-block">
          <p>{error || 'Pokémon not found'}</p>
        </div>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  // Get English description
  const description = pokemon.species?.flavor_text_entries
    .find(entry => entry.language.name === 'en')?.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\u00ad\n/g, '')
    .replace(/\u00ad/g, '')
    .replace(/\n/g, ' ');
  
  const genus = pokemon.species?.genera.find(g => g.language.name === 'en')?.genus;
  
  const favorite = isFavorite(pokemon.id.toString());
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-1" />
          Back to list
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header section with image and basic info */}
        <div className="relative p-6 md:p-8 bg-gray-100">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 md:w-1/3 flex justify-center">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48 object-contain"
              />
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0 md:pl-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
                  <p className="text-gray-500 mb-4">#{pokemon.id.toString().padStart(3, '0')}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {pokemon.types.map(typeInfo => (
                      <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name as any} size="md" />
                    ))}
                  </div>
                  
                  {genus && <p className="text-gray-700 mb-2">{genus}</p>}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-full border ${
                      favorite 
                        ? 'bg-red-50 border-red-300 text-red-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'
                    }`}
                    aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={favorite ? 'fill-red-500' : ''} size={20} />
                  </button>
                  
                  <Link
                    to={`/compare?pokemon1=${pokemon.id}`}
                    className="p-2 rounded-full border bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"
                    aria-label="Compare this Pokémon"
                  >
                    <GitCompare size={20} />
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                <div>
                  <p className="text-gray-500 text-sm">Height</p>
                  <p className="font-medium">{pokemon.height / 10} m</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Weight</p>
                  <p className="font-medium">{pokemon.weight / 10} kg</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Abilities</p>
                  <p className="font-medium capitalize">
                    {pokemon.abilities
                      .map(a => a.ability.name.replace('-', ' '))
                      .join(', ')}
                  </p>
                </div>
                {pokemon.species?.habitat && (
                  <div>
                    <p className="text-gray-500 text-sm">Habitat</p>
                    <p className="font-medium capitalize">{pokemon.species.habitat.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-center flex-1 font-medium ${
              activeTab === 'about' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 text-center flex-1 font-medium ${
              activeTab === 'stats' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-3 text-center flex-1 font-medium ${
              activeTab === 'evolution' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Evolution
          </button>
          <button
            onClick={() => setActiveTab('moves')}
            className={`px-4 py-3 text-center flex-1 font-medium ${
              activeTab === 'moves' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Moves
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <p className="text-gray-700 mb-6">{description || 'No description available.'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Profile</h3>
                  <table className="w-full">
                    <tbody>
                      {pokemon.species?.growth_rate && (
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Growth Rate</td>
                          <td className="py-2 font-medium capitalize">{pokemon.species.growth_rate.name.replace('-', ' ')}</td>
                        </tr>
                      )}
                      {pokemon.species?.is_legendary && (
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Legendary</td>
                          <td className="py-2 font-medium">Yes</td>
                        </tr>
                      )}
                      {pokemon.species?.is_mythical && (
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Mythical</td>
                          <td className="py-2 font-medium">Yes</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Abilities</h3>
                  <ul className="space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <li key={ability.ability.name} className="pb-2 border-b border-gray-200">
                        <div className="font-medium capitalize">{ability.ability.name.replace('-', ' ')}</div>
                        {ability.is_hidden && (
                          <div className="text-sm text-gray-600">(Hidden Ability)</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <PokemonStats stats={pokemon.stats} />
          )}
          
          {activeTab === 'evolution' && (
            <PokemonEvolution evolutionChain={pokemon.evolutionChain} />
          )}
          
          {activeTab === 'moves' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Moves</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {pokemon.moves.slice(0, 100).map(move => (
                  <div 
                    key={move.move.name} 
                    className="bg-gray-100 rounded-md px-3 py-2 capitalize text-sm"
                  >
                    {move.move.name.replace('-', ' ')}
                  </div>
                ))}
                {pokemon.moves.length > 100 && (
                  <div className="bg-gray-100 rounded-md px-3 py-2 text-gray-500 text-sm">
                    +{pokemon.moves.length - 100} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;