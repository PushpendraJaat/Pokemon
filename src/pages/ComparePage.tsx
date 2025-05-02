import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, X } from 'lucide-react';
import { usePokemon } from '../contexts/PokemonContext';
import { PokemonDetails } from '../types/pokemon';
import TypeBadge from '../components/TypeBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchPokemonDetail } = usePokemon();
  
  const [pokemon1, setPokemon1] = useState<PokemonDetails | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonDetails | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  useEffect(() => {
    
    const pokemon1Id = searchParams.get('pokemon1');
    const pokemon2Id = searchParams.get('pokemon2');
    
    if (pokemon1Id) {
      loadPokemon(pokemon1Id, 1);
    }
    
    if (pokemon2Id) {
      loadPokemon(pokemon2Id, 2);
    }
  }, [searchParams]);
  
  const loadPokemon = async (id: string, slot: 1 | 2) => {
    const setLoading = slot === 1 ? setLoading1 : setLoading2;
    const setError = slot === 1 ? setError1 : setError2;
    const setPokemon = slot === 1 ? setPokemon1 : setPokemon2;
    
    try {
      setLoading(true);
      setError(null);
      
      const pokemonId = id.toLowerCase();
      const details = await fetchPokemonDetail(pokemonId);
      
      if (details) {
        setPokemon(details);
        updateSearchParams(slot, details.id.toString());
      } else {
        setError('Failed to load Pokémon');
      }
    } catch (err) {
      console.error(`Error loading Pokémon ${slot}:`, err);
      setError('Pokémon not found. Please try another name or ID.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateSearchParams = (slot: 1 | 2, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null) {
      newParams.delete(`pokemon${slot}`);
    } else {
      newParams.set(`pokemon${slot}`, value);
    }
    
    setSearchParams(newParams);
  };
  
  const handleRandom = async (slot: 1 | 2) => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    loadPokemon(randomId.toString(), slot);
  };
  
  const handleClear = (slot: 1 | 2) => {
    if (slot === 1) {
      setPokemon1(null);
    } else {
      setPokemon2(null);
    }
    updateSearchParams(slot, null);
  };
  
  const getStatDiff = (stat1: number, stat2: number) => {
    if (!pokemon2) return null;
    
    const diff = stat1 - stat2;
    if (diff === 0) return 'text-gray-500';
    return diff > 0 ? 'text-green-600' : 'text-red-600';
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-1" />
          Back to list
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Compare Pokemon</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pokémon 1 Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SearchBar
              onSelect={(id) => loadPokemon(id, 1)}
              placeholder="Search first Pokemon..."
              className="flex-1"
            />
            <button
              onClick={() => handleRandom(1)}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              aria-label="Random Pokemon"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          
          {loading1 ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error1 ? (
            <div className="py-4 text-center">
              <p className="text-red-600">{error1}</p>
            </div>
          ) : pokemon1 ? (
            <div className="relative">
              <button
                onClick={() => handleClear(1)}
                className="absolute top-0 right-0 p-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                aria-label="Clear Pokemon"
              >
                <X size={16} />
              </button>
              
              <div className="flex flex-col items-center mb-4">
                <img
                  src={pokemon1.sprites.other['official-artwork'].front_default || pokemon1.sprites.front_default}
                  alt={pokemon1.name}
                  className="w-32 h-32 object-contain"
                />
                <h3 className="text-xl font-bold capitalize mt-2">{pokemon1.name}</h3>
                <p className="text-gray-500">#{pokemon1.id.toString().padStart(3, '0')}</p>
                
                <div className="flex gap-2 mt-2">
                  {pokemon1.types.map(typeInfo => (
                    <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name as any} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>Select a Pokemon to compare</p>
            </div>
          )}
        </div>
        
        {/* Pokémon 2 Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SearchBar
              onSelect={(id) => loadPokemon(id, 2)}
              placeholder="Search second Pokemon..."
              className="flex-1"
            />
            <button
              onClick={() => handleRandom(2)}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              aria-label="Random Pokemon"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          
          {loading2 ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error2 ? (
            <div className="py-4 text-center">
              <p className="text-red-600">{error2}</p>
            </div>
          ) : pokemon2 ? (
            <div className="relative">
              <button
                onClick={() => handleClear(2)}
                className="absolute top-0 right-0 p-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                aria-label="Clear Pokémon"
              >
                <X size={16} />
              </button>
              
              <div className="flex flex-col items-center mb-4">
                <img
                  src={pokemon2.sprites.other['official-artwork'].front_default || pokemon2.sprites.front_default}
                  alt={pokemon2.name}
                  className="w-32 h-32 object-contain"
                />
                <h3 className="text-xl font-bold capitalize mt-2">{pokemon2.name}</h3>
                <p className="text-gray-500">#{pokemon2.id.toString().padStart(3, '0')}</p>
                
                <div className="flex gap-2 mt-2">
                  {pokemon2.types.map(typeInfo => (
                    <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name as any} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>Select a Pokemon to compare</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Comparison Table */}
      {pokemon1 && pokemon2 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Stat Comparison</h2>
          
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-600">Stat</th>
                <th className="py-3 px-4 text-center text-gray-600 capitalize">{pokemon1.name}</th>
                <th className="py-3 px-4 text-center text-gray-600">Difference</th>
                <th className="py-3 px-4 text-center text-gray-600 capitalize">{pokemon2.name}</th>
              </tr>
            </thead>
            <tbody>
              {pokemon1.stats.map((stat, index) => {
                const stat1 = stat.base_stat;
                const stat2 = pokemon2.stats[index]?.base_stat || 0;
                const diff = stat1 - stat2;
                const statName = stat.stat.name.replace('-', ' ');
                
                return (
                  <tr key={stat.stat.name} className="border-b">
                    <td className="py-3 px-4 capitalize font-medium">{statName}</td>
                    <td className="py-3 px-4 text-center">{stat1}</td>
                    <td className={`py-3 px-4 text-center font-medium ${getStatDiff(stat1, stat2)}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </td>
                    <td className="py-3 px-4 text-center">{stat2}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-center">
                  {pokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                </td>
                <td className={`py-3 px-4 text-center font-medium ${
                  getStatDiff(
                    pokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0),
                    pokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0)
                  )
                }`}>
                  {pokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0) - 
                   pokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                </td>
                <td className="py-3 px-4 text-center">
                  {pokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Info</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Height</td>
                    <td className="py-2 text-center">{pokemon1.height / 10} m</td>
                    <td className="py-2 text-center">{pokemon2.height / 10} m</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Weight</td>
                    <td className="py-2 text-center">{pokemon1.weight / 10} kg</td>
                    <td className="py-2 text-center">{pokemon2.weight / 10} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Abilities</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-600 mb-1 capitalize">{pokemon1.name}</h4>
                  <ul className="space-y-1">
                    {pokemon1.abilities.map(ability => (
                      <li key={ability.ability.name} className="capitalize text-sm">
                        {ability.ability.name.replace('-', ' ')}
                        {ability.is_hidden && <span className="text-xs text-gray-500 ml-1">(Hidden)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600 mb-1 capitalize">{pokemon2.name}</h4>
                  <ul className="space-y-1">
                    {pokemon2.abilities.map(ability => (
                      <li key={ability.ability.name} className="capitalize text-sm">
                        {ability.ability.name.replace('-', ' ')}
                        {ability.is_hidden && <span className="text-xs text-gray-500 ml-1">(Hidden)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage