import axios from 'axios';
import { PokemonListResponse, PokemonDetails, PokemonSpeciesInfo, PokemonEvolutionChain } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Fetch a list of Pokemon with pagination
export const getPokemonList = async (offset: number = 0, limit: number = 20): Promise<PokemonListResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon`, {
      params: { offset, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

// Fetch detailed information about a specific Pokemon
export const getPokemonDetails = async (id: string): Promise<PokemonDetails> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon details for ID: ${id}`, error);
    throw error;
  }
};

// Fetch species information about a specific Pokemon
export const getPokemonSpecies = async (id: string): Promise<PokemonSpeciesInfo> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon-species/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon species for ID: ${id}`, error);
    throw error;
  }
};

// Fetch evolution chain information
export const getEvolutionChain = async (id: string): Promise<PokemonEvolutionChain> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/evolution-chain/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching evolution chain for ID: ${id}`, error);
    throw error;
  }
};

// Fetch Pokemon types for filtering
export const getPokemonTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/type`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching Pokemon types:', error);
    throw error;
  }
};