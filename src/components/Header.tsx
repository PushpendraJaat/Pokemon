import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { PokemonDetails } from '../types/pokemon';
import SearchSuggestions from './SearchSuggestions';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  allPokemon: PokemonDetails[];
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, allPokemon }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get suggestions based on search term
  const suggestions = searchTerm
    ? allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString() === searchTerm
      ).slice(0, 5)
    : [];

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (name: string) => {
    onSearchChange(name);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm px-8">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <a href="/"><h1 className="text-2xl md:text-3xl font-bold text-red-500">Pokemon Search</h1></a>
        </div>
        
        <div className="w-full md:w-auto relative" ref={searchContainerRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={handleSearchFocus}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            visible={showSuggestions}
            searchInputRef={searchInputRef}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;