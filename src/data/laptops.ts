import { Laptop } from '../types';

export const laptops: Laptop[] = [
  {
    id: '1',
    brand: 'Dell',
    model: 'XPS 15',
    price: 1799,
    specs: {
      processor: 'Intel Core i7-12700H',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      display: '15.6" 4K OLED',
      gpu: 'NVIDIA RTX 3050 Ti',
    },
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800',
  },
  {
    id: '2',
    brand: 'Apple',
    model: 'MacBook Pro',
    price: 1999,
    specs: {
      processor: 'M2 Pro',
      ram: '16GB Unified',
      storage: '512GB SSD',
      display: '14" Liquid Retina XDR',
      gpu: 'M2 Pro 16-core',
    },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800',
  },
  {
    id: '3',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    price: 1599,
    specs: {
      processor: 'Intel Core i5-1240P',
      ram: '16GB LPDDR5',
      storage: '1TB NVMe SSD',
      display: '14" WQUXGA',
      gpu: 'Intel Iris Xe',
    },
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800',
  },
];