import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchAllPokemonWithDetails } from '../api/pokemon';
import { PokemonDetails } from '../types/pokemon';

const ITEMS_PER_PAGE = 20;

export function usePokemon() {
  const [allPokemon, setAllPokemon] = useState<PokemonDetails[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Debounce search term to avoid excessive filtering
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const paginatedPokemon = filteredPokemon.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Fetch all pokemon on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const pokemonData = await fetchAllPokemonWithDetails(150);
        setAllPokemon(pokemonData);
        setFilteredPokemon(pokemonData);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('Failed to fetch Pokemon'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when search or type changes
  useEffect(() => {
    let result = allPokemon;
    
    // Filter by search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchLower) || 
        pokemon.id.toString() === debouncedSearchTerm
      );
    }
    
    // Filter by type
    if (selectedType) {
      result = result.filter(pokemon => 
        pokemon.types.some(t => t.type.name === selectedType)
      );
    }
    
    setFilteredPokemon(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [debouncedSearchTerm, selectedType, allPokemon]);

  return {
    pokemon: paginatedPokemon,
    allPokemon,
    totalPokemon: filteredPokemon.length,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages
  };
}