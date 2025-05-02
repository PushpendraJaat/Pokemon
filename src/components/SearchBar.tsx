import React, { useState, useEffect, useRef, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../contexts/PokemonContext';

interface SearchBarProps {
  onSelect?: (id: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSelect,
  placeholder = "Search Pokemon...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number>();
  const navigate = useNavigate();
  const { searchPokemon, searchResults, searchLoading } = usePokemon();

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      searchPokemon(query);
    }, 300);

    return () => window.clearTimeout(debounceRef.current);
  }, [query, searchPokemon]);

  const resetSearch = useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      if (onSelect) {
        onSelect(id);
      } else {
        navigate(`/pokemon/${id}`);
      }
      resetSearch();
    },
    [navigate, onSelect, resetSearch]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(searchResults[selectedIndex].id);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
        />
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {query && (
          <button
            onClick={resetSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showSuggestions && (query || searchLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-auto">
          {searchLoading ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((pokemon, index) => (
                <li key={pokemon.id}>
                  <button
                    onClick={() => handleSelect(pokemon.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 ${
                      selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={pokemon.imageUrl} 
                      alt={pokemon.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <div className="font-medium capitalize">{pokemon.name}</div>
                      <div className="text-sm text-gray-500">#{pokemon.id.padStart(3, '0')}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query && (
            <div className="px-4 py-2 text-gray-500">No Pokemon found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
