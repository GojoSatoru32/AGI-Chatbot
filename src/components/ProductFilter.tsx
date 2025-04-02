import React from 'react';
import { FilterState } from '../App';

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export function ProductFilter({ onFilterChange, currentFilters }: ProductFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...currentFilters,
      [name]: name === 'minPrice' || name === 'maxPrice' ? Number(value) : value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <select
            name="brand"
            value={currentFilters.brand}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Brands</option>
            <option value="Dell">Dell</option>
            <option value="Apple">Apple</option>
            <option value="Lenovo">Lenovo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={currentFilters.minPrice || ''}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={currentFilters.maxPrice || ''}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}