import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { getPokemonList, getPokemonDetails, getPokemonSpecies, getEvolutionChain } from '../api/pokemon';
import { Pokemon, PokemonDetails, PokemonListResponse, PokemonType } from '../types/pokemon';

interface PokemonContextType {
  pokemonList: Pokemon[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  selectedTypes: PokemonType[];
  searchResults: Pokemon[];
  searchLoading: boolean;
  searchError: string | null;
  fetchPokemonList: () => Promise<void>;
  fetchPokemonDetail: (id: string) => Promise<PokemonDetails | null>;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  toggleTypeFilter: (type: PokemonType) => void;
  getRandomPokemon: () => Promise<string>;
  searchPokemon: (query: string) => Promise<void>;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchPokemonList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (currentPage - 1) * itemsPerPage;
      const response: PokemonListResponse = await getPokemonList(offset, itemsPerPage);
      
      setTotalCount(response.count);
      
      const pokemonDetailsPromises = response.results.map(async (pokemon) => {
        const id = pokemon.url.split('/').filter(Boolean).pop() || '';
        const details = await getPokemonDetails(id);
        return {
          id,
          name: pokemon.name,
          imageUrl: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
          types: details.types.map(t => t.type.name as PokemonType)
        };
      });
      
      let detailedPokemon = await Promise.all(pokemonDetailsPromises);
      
      if (selectedTypes.length > 0) {
        detailedPokemon = detailedPokemon.filter(pokemon => 
          selectedTypes.every(type => pokemon.types.includes(type))
        );
      }
      
      detailedPokemon.sort((a, b) => {
        if (sortBy === 'id') {
          return sortOrder === 'asc' 
            ? parseInt(a.id) - parseInt(b.id)
            : parseInt(b.id) - parseInt(a.id);
        } else if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        return 0;
      });
      
      setPokemonList(detailedPokemon);
    } catch (err) {
      setError('Failed to fetch Pokemon list. Please try again later.');
      console.error('Error fetching Pokemon list:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedTypes, sortBy, sortOrder]);

  const searchPokemon = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);

      const response = await getPokemonList(0, 1000);
      const filtered = response.results
        .filter(pokemon => pokemon.name.includes(query.toLowerCase()))
        .slice(0, 5);

      const detailedResults = await Promise.all(
        filtered.map(async (pokemon) => {
          const id = pokemon.url.split('/').filter(Boolean).pop() || '';
          const details = await getPokemonDetails(id);
          return {
            id,
            name: pokemon.name,
            imageUrl: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
            types: details.types.map(t => t.type.name as PokemonType)
          };
        })
      );

      setSearchResults(detailedResults);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      setSearchError('Failed to search Pokemon');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const fetchPokemonDetail = useCallback(async (id: string): Promise<PokemonDetails | null> => {
    try {
      const details = await getPokemonDetails(id);
      const species = await getPokemonSpecies(id);
      
      let evolutionChain = null;
      if (species.evolution_chain?.url) {
        const evolutionChainId = species.evolution_chain.url.split('/').filter(Boolean).pop();
        if (evolutionChainId) {
          evolutionChain = await getEvolutionChain(evolutionChainId);
        }
      }
      
      return {
        ...details,
        species,
        evolutionChain
      };
    } catch (err) {
      console.error('Error fetching Pokemon details:', err);
      return null;
    }
  }, []);

  const toggleTypeFilter = useCallback((type: PokemonType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
    setCurrentPage(1);
  }, []);

  const getRandomPokemon = useCallback(async (): Promise<string> => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    return randomId.toString();
  }, []);

  useEffect(() => {
    fetchPokemonList();
  }, [fetchPokemonList]);

  const value = {
    pokemonList,
    loading,
    error,
    totalCount,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    selectedTypes,
    searchResults,
    searchLoading,
    searchError,
    fetchPokemonList,
    fetchPokemonDetail,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortOrder,
    toggleTypeFilter,
    getRandomPokemon,
    searchPokemon
  };

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};