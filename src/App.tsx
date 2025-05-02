import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { PokemonProvider } from './contexts/PokemonContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage from './pages/ComparePage';
import ErrorFallback from './components/ErrorFallback';
import Footer from './components/Footer';


function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <PokemonProvider>
          <FavoritesProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Header />
              <main className="flex-grow container mx-auto sm:px-16 px-6 py-6">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </FavoritesProvider>
        </PokemonProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;