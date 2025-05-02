import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { PokemonType } from '../types/pokemon';
import TypeBadge from '../components/TypeBadge';
import { usePokemon } from '../contexts/PokemonContext';
import { getPokemonTypes } from '../api/pokemon';

const TypeFilter: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableTypes, setAvailableTypes] = useState<PokemonType[]>([]);
  const { selectedTypes, toggleTypeFilter } = usePokemon();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getPokemonTypes();
        setAvailableTypes(types.map((type: any) => type.name) as PokemonType[]);
      } catch (error) {
        console.error('Error fetching Pokemon types:', error);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className="relative mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center gap-2 bg-white shadow-md rounded-lg px-4 py-2 text-blue-600 hover:text-blue-800 transition"
      >
        {isFilterOpen ? <X size={18} /> : <Filter size={18} />}
        <span className="font-medium">{isFilterOpen ? 'Close Filter' : 'Filter by Type'}</span>
      </button>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-4 border border-gray-200 animate-fadeIn">
          {/* Type Badges */}
          <div className="flex flex-wrap gap-3">
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`transition-transform duration-200 ${
                  selectedTypes.includes(type)
                    ? 'scale-110 ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:scale-105'
                }`}
              >
                <TypeBadge type={type} />
              </button>
            ))}
          </div>

          {/* Selected Types */}
          {selectedTypes.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 font-medium">Selected Types:</span>
                <button
                  onClick={() => selectedTypes.forEach((type) => toggleTypeFilter(type))}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedTypes.map((type) => (
                  <div key={type} className="relative group">
                    <TypeBadge type={type} />
                    <button
                      onClick={() => toggleTypeFilter(type)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${type} filter`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypeFilter;
