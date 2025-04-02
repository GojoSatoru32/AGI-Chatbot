export interface Laptop {
  id: string;
  brand: string;
  model: string;
  price: number;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    display: string;
    gpu: string;
  };
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}