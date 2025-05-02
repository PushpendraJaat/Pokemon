import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Pokemon } from '../types/pokemon';

interface FavoritesContextType {
  favorites: Pokemon[];
  addFavorite: (pokemon: Pokemon) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('pokemonFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('pokemonFavorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((pokemon: Pokemon) => {
    setFavorites(prev => {
      if (prev.some(p => p.id === pokemon.id)) {
        return prev;
      }
      return [...prev, pokemon];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(pokemon => pokemon.id !== id));
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(pokemon => pokemon.id === id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};