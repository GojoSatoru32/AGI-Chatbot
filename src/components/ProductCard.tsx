import React from 'react';
import { Laptop } from '../types';

interface ProductCardProps {
  laptop: Laptop;
}

export function ProductCard({ laptop }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={laptop.image} 
        alt={`${laptop.brand} ${laptop.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{laptop.brand} {laptop.model}</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">${laptop.price}</p>
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <p>Processor: {laptop.specs.processor}</p>
          <p>RAM: {laptop.specs.ram}</p>
          <p>Storage: {laptop.specs.storage}</p>
          <p>Display: {laptop.specs.display}</p>
          <p>GPU: {laptop.specs.gpu}</p>
        </div>
      </div>
    </div>
  );
}