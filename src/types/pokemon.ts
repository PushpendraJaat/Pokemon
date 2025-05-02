export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' 
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
  types: PokemonType[];
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonTypeInfo {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonSpeciesInfo {
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  growth_rate: {
    name: string;
  };
  habitat: {
    name: string;
  } | null;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
}

export interface PokemonEvolutionChain {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: {
      species: {
        name: string;
        url: string;
      };
      evolution_details: {
        min_level: number;
        trigger: {
          name: string;
        };
        item: {
          name: string;
        } | null;
      }[];
      evolves_to: {
        species: {
          name: string;
          url: string;
        };
        evolution_details: {
          min_level: number;
          trigger: {
            name: string;
          };
          item: {
            name: string;
          } | null;
        }[];
      }[];
    }[];
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  types: PokemonTypeInfo[];
  sprites: {
    front_default: string;
    back_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      'dream_world': {
        front_default: string;
      };
    };
  };
  species?: PokemonSpeciesInfo;
  evolutionChain?: PokemonEvolutionChain;
}