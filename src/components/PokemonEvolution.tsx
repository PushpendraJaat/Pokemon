import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PokemonEvolutionChain } from '../types/pokemon';
import { getPokemonDetails } from '../api/pokemon';
import LoadingSpinner from '../components/LoadingSpinner';

interface PokemonEvolutionProps {
  evolutionChain: PokemonEvolutionChain | undefined;
}

interface EvolutionNode {
  name: string;
  id: string;
  imageUrl: string;
  evolvesTo: EvolutionNode[];
  evolutionDetails?: {
    minLevel?: number;
    trigger?: string;
    item?: string;
  };
}

const PokemonEvolution: React.FC<PokemonEvolutionProps> = ({ evolutionChain }) => {
  const [evolutionData, setEvolutionData] = useState<EvolutionNode | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const processEvolutionChain = async () => {
      if (!evolutionChain) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Process the chain recursively
        const processChain = async (chain: any): Promise<EvolutionNode> => {
          const speciesUrl = chain.species.url;
          const id = speciesUrl.split('/').filter(Boolean).pop() || '';
          
          // Get Pokemon details to get image
          const details = await getPokemonDetails(id);
          
          // Process evolution details
          let evolutionDetails;
          if (chain.evolution_details && chain.evolution_details.length > 0) {
            const detail = chain.evolution_details[0];
            evolutionDetails = {
              minLevel: detail.min_level,
              trigger: detail.trigger?.name,
              item: detail.item?.name
            };
          }
          
          // Process all evolutions
          const evolutions = await Promise.all(
            chain.evolves_to.map((evo: any) => processChain(evo))
          );
          
          return {
            name: chain.species.name,
            id,
            imageUrl: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
            evolvesTo: evolutions,
            evolutionDetails
          };
        };
        
        const rootNode = await processChain(evolutionChain.chain);
        setEvolutionData(rootNode);
      } catch (error) {
        console.error('Error processing evolution chain:', error);
      } finally {
        setLoading(false);
      }
    };
    
    processEvolutionChain();
  }, [evolutionChain]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!evolutionData) {
    return <p className="text-gray-500 italic">Evolution data not available.</p>;
  }
  
  // Recursive component to display evolution tree
  const EvolutionTree: React.FC<{ node: EvolutionNode }> = ({ node }) => {
    return (
      <div className="flex flex-col sm:flex-row items-center">
        <Link to={`/pokemon/${node.id}`} className="group">
          <div className="flex flex-col items-center transition-transform hover:scale-105">
            <img 
              src={node.imageUrl} 
              alt={node.name} 
              className="w-24 h-24 object-contain"
            />
            <span className="capitalize font-medium text-center mt-1">{node.name}</span>
            <span className="text-gray-500 text-sm">#{node.id}</span>
          </div>
        </Link>
        
        {node.evolvesTo.length > 0 && (
          <>
            <div className="mx-2 my-4 sm:my-0 flex flex-col items-center">
              <ChevronRight size={24} className="text-gray-400" />
              {node.evolvesTo[0].evolutionDetails && (
                <div className="text-xs text-center text-gray-600 mt-1">
                  {node.evolvesTo[0].evolutionDetails.minLevel && 
                    <div>Level {node.evolvesTo[0].evolutionDetails.minLevel}</div>
                  }
                  {node.evolvesTo[0].evolutionDetails.item && 
                    <div>Use {node.evolvesTo[0].evolutionDetails.item.replace('-', ' ')}</div>
                  }
                  {!node.evolvesTo[0].evolutionDetails.minLevel && !node.evolvesTo[0].evolutionDetails.item && 
                    <div>{node.evolvesTo[0].evolutionDetails.trigger}</div>
                  }
                </div>
              )}
            </div>
            
            <EvolutionTree node={node.evolvesTo[0]} />
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Evolution Chain</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <EvolutionTree node={evolutionData} />
      </div>
    </div>
  );
};

export default PokemonEvolution;