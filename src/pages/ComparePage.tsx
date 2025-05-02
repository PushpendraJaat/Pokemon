import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, X } from 'lucide-react';
import { usePokemonCompare } from '../hooks/usePokemonCompare';
import TypeBadge from '../components/TypeBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

const getStatDiffClass = (diff: number) => {
  if (diff === 0) return 'text-gray-500';
  return diff > 0 ? 'text-green-600' : 'text-red-600';
};

const ComparePage: React.FC = () => {
  const {
    pokemon1, pokemon2, loading1, loading2, error1, error2,
    loadPokemon, handleRandom, handleClear
  } = usePokemonCompare();

  const total1 = useMemo(() => pokemon1?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0, [pokemon1]);
  const total2 = useMemo(() => pokemon2?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0, [pokemon2]);

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
        {[1, 2].map((slot) => {
          const pokemon = slot === 1 ? pokemon1 : pokemon2;
          const loading = slot === 1 ? loading1 : loading2;
          const error = slot === 1 ? error1 : error2;

          return (
            <div key={slot} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SearchBar
                  onSelect={(id) => loadPokemon(id, slot)}
                  placeholder={`Search ${slot === 1 ? 'first' : 'second'} Pokemon...`}
                  className="flex-1"
                />
                <button
                  onClick={() => handleRandom(slot)}
                  className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  aria-label="Random Pokemon"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              {loading ? (
                <div className="py-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="py-4 text-center">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : pokemon ? (
                <div className="relative">
                  <button
                    onClick={() => handleClear(slot)}
                    className="absolute top-0 right-0 p-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                    aria-label="Clear Pokemon"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-32 h-32 object-contain"
                    />
                    <h3 className="text-xl font-bold capitalize mt-2">{pokemon.name}</h3>
                    <p className="text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</p>

                    <div className="flex gap-2 mt-2">
                      {pokemon.types.map(typeInfo => (
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
          );
        })}
      </div>

      {pokemon1 && pokemon2 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Stat Comparison</h2>

          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Stat</th>
                <th className="py-3 sm:px-4 px-1 text-center text-gray-600 capitalize">{pokemon1.name}</th>
                <th className="py-3 sm:px-4 px-1 text-center text-gray-600">Difference</th>
                <th className="py-3 sm:px-4 px-1 text-center text-gray-600 capitalize">{pokemon2.name}</th>
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
                    <td className={`py-3 px-4 text-center font-medium ${getStatDiffClass(diff)}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </td>
                    <td className="py-3 px-4 text-center">{stat2}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-center">{total1}</td>
                <td className={`py-3 px-4 text-center font-medium ${getStatDiffClass(total1 - total2)}`}>
                  {total1 - total2 > 0 ? `+${total1 - total2}` : total1 - total2}
                </td>
                <td className="py-3 px-4 text-center">{total2}</td>
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
                {[pokemon1, pokemon2].map((p) => (
                  <div key={p.name}>
                    <h4 className="text-sm text-gray-600 mb-1 capitalize">{p.name}</h4>
                    <ul className="space-y-1">
                      {p.abilities.map(ability => (
                        <li key={ability.ability.name} className="capitalize text-sm">
                          {ability.ability.name.replace('-', ' ')}
                          {ability.is_hidden && <span className="text-xs text-gray-500 ml-1">(Hidden)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
