import React, { useEffect, useState } from 'react';
import { PokemonDetails } from '../types/pokemon';

interface SearchSuggestionsProps {
  suggestions: PokemonDetails[];
  onSelect: (name: string) => void;
  visible: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSelect, visible, searchInputRef }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1); // Reset selection when suggestions change
  }, [suggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            onSelect(suggestions[selectedIndex].name);
          }
          break;
        case 'Escape':
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, suggestions, selectedIndex, onSelect, searchInputRef]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-20">
      {suggestions.map((pokemon, index) => (
        <button
          key={pokemon.id}
          onClick={() => onSelect(pokemon.name)}
          className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors ${
            index === selectedIndex ? 'bg-gray-100' : ''
          }`}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name}
            className="w-8 h-8"
          />
          <span className="capitalize">{pokemon.name}</span>
          <span className="text-gray-500 text-sm ml-auto">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;