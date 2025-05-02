import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Home, RefreshCw, GitCompare } from 'lucide-react';
import { usePokemon } from '../contexts/PokemonContext';
import SearchBar from '../components/SearchBar';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getRandomPokemon } = usePokemon();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRandomPokemon = async () => {
    const randomId = await getRandomPokemon();
    window.location.href = `/pokemon/${randomId}`;
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600';
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-red-500">Pokemon Viewer</span>
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`flex items-center space-x-1 ${isActive('/')}`}>
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/favorites" className={`flex items-center space-x-1 ${isActive('/favorites')}`}>
              <Heart size={18} />
              <span>Favorites</span>
            </Link>
            <Link to="/compare" className={`flex items-center space-x-1 ${isActive('/compare')}`}>
              <GitCompare size={18} />
              <span>Compare</span>
            </Link>
            <button 
              onClick={handleRandomPokemon}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <RefreshCw size={18} />
              <span>Random</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4 animate-fadeIn">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${isActive('/')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link 
                to="/favorites" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${isActive('/favorites')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={18} />
                <span>Favorites</span>
              </Link>
              <Link 
                to="/compare" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${isActive('/compare')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <GitCompare size={18} />
                <span>Compare</span>
              </Link>
              <button 
                onClick={() => {
                  handleRandomPokemon();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <RefreshCw size={18} />
                <span>Random Pokemon</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar