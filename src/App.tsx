import React, { useState } from 'react';
import { Laptop } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductFilter } from './components/ProductFilter';
import { Chatbot } from './components/Chatbot';
import { laptops } from './data/laptops';

export type FilterState = {
  brand: string;
  minPrice: number;
  maxPrice: number;
};

// Create a context to share filter state
export const FilterContext = React.createContext<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}>({
  filters: { brand: '', minPrice: 0, maxPrice: 10000 },
  setFilters: () => {},
});

function App() {
  const [filters, setFilters] = useState<FilterState>({
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
  });

  const filteredLaptops = laptops.filter((laptop) => {
    const matchesBrand = filters.brand ? laptop.brand.toLowerCase() === filters.brand.toLowerCase() : true;
    const matchesPrice = laptop.price >= filters.minPrice && laptop.price <= filters.maxPrice;
    return matchesBrand && matchesPrice;
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-2">
              <Laptop className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">LaptopStore</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ProductFilter onFilterChange={setFilters} currentFilters={filters} />
            </div>
            
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaptops.map((laptop) => (
                  <ProductCard key={laptop.id} laptop={laptop} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Chatbot />
      </div>
    </FilterContext.Provider>
  );
}

export default App;