import { PokemonDetails, PokemonListResponse } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 150): Promise<PokemonListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export async function fetchPokemonDetails(url: string): Promise<PokemonDetails> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    throw error;
  }
}

export async function fetchAllPokemonWithDetails(limit = 150): Promise<PokemonDetails[]> {
  try {
    const listResponse = await fetchPokemonList(limit);
    const detailsPromises = listResponse.results.map(pokemon => 
      fetchPokemonDetails(pokemon.url)
    );
    
    return await Promise.all(detailsPromises);
  } catch (error) {
    console.error('Error fetching all Pokemon details:', error);
    throw error;
  }
}