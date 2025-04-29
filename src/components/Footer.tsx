import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p className='text-sm'>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">PokéAPI</a></p>
        <p>Made by <a href="https://pushpendrajaat.in/" target="_blank" rel="referral" className="text-red-500 hover:underline">Pushpendra Jaat</a></p>
      </div>
    </footer>
  )
}

export default Footer
