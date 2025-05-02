import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePokemon } from '../contexts/PokemonContext';
import { PokemonDetails } from '../types/pokemon';
import debounce from 'lodash.debounce';

export function usePokemonCompare() {
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

    if (pokemon1Id) loadPokemon(pokemon1Id, 1);
    if (pokemon2Id) loadPokemon(pokemon2Id, 2);
  }, [searchParams]);

  const updateSearchParams = useCallback((slot: 1 | 2, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null) {
      newParams.delete(`pokemon${slot}`);
    } else {
      newParams.set(`pokemon${slot}`, value);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const loadPokemon = useCallback(async (id: string, slot: 1 | 2) => {
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
  }, [fetchPokemonDetail, updateSearchParams]);

  const handleRandom = useCallback(debounce((slot: 1 | 2) => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    loadPokemon(randomId.toString(), slot);
  }, 300), [loadPokemon]);

  const handleClear = useCallback((slot: 1 | 2) => {
    if (slot === 1) {
      setPokemon1(null);
    } else {
      setPokemon2(null);
    }
    updateSearchParams(slot, null);
  }, [updateSearchParams]);

  return {
    pokemon1, pokemon2, loading1, loading2, error1, error2,
    loadPokemon, handleRandom, handleClear
  };
}
