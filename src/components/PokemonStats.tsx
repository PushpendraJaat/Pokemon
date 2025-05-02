import React from 'react';
import { PokemonStat } from '../types/pokemon';

interface PokemonStatsProps {
  stats: PokemonStat[];
}

const PokemonStats: React.FC<PokemonStatsProps> = ({ stats }) => {
  // Map stat names to more readable format
  const statNameMap: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    'speed': 'Speed'
  };
  
  // Get max value for scaling
  const maxPossibleStat = 255; // The highest possible base stat in Pokemon
  
  // Color mapping for different stats
  const statColors: Record<string, string> = {
    'hp': 'bg-red-500',
    'attack': 'bg-orange-500',
    'defense': 'bg-yellow-500',
    'special-attack': 'bg-blue-500',
    'special-defense': 'bg-green-500',
    'speed': 'bg-purple-500'
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Base Stats</h3>
      
      <div className="space-y-3">
        {stats.map(stat => (
          <div key={stat.stat.name} className="flex items-center">
            <div className="w-24 text-right mr-4">
              <span className="font-medium">{statNameMap[stat.stat.name] || stat.stat.name}</span>
            </div>
            
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${statColors[stat.stat.name] || 'bg-gray-500'} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${Math.min(100, (stat.base_stat / maxPossibleStat) * 100)}%`,
                    animation: 'growStat 1.5s ease-out' 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="w-12 text-right ml-2">
              <span className="font-bold">{stat.base_stat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonStats;