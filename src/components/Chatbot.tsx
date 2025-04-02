import React, { useState, useContext } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { laptops } from '../data/laptops';
import { FilterContext } from '../App';

const HUGGING_FACE_TOKEN = "apply_ur_token_here";
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setFilters } = useContext(FilterContext);

  const extractFilters = (message: string) => {
    const lowerMessage = message.toLowerCase();
    let filters = {
      brand: '',
      minPrice: 0,
      maxPrice: 10000
    };

    // Extract brand
    const brands = ['dell', 'apple', 'lenovo'];
    for (const brand of brands) {
      if (lowerMessage.includes(brand)) {
        filters.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
        break;
      }
    }

    // Extract price range
    const priceMatch = message.match(/under \$?(\d+)/i) || message.match(/less than \$?(\d+)/i);
    if (priceMatch) {
      filters.maxPrice = parseInt(priceMatch[1]);
    }

    const minPriceMatch = message.match(/over \$?(\d+)/i) || message.match(/more than \$?(\d+)/i);
    if (minPriceMatch) {
      filters.minPrice = parseInt(minPriceMatch[1]);
    }

    return filters;
  };

  const generateResponse = async (userMessage: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify({ inputs: userMessage }),
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      let botResponse = result[0]?.generated_text || "I'm having trouble understanding that. Could you rephrase?";
      
      // Extract and apply filters from user message
      const filters = extractFilters(userMessage);
      const hasFilters = filters.brand || filters.minPrice > 0 || filters.maxPrice < 10000;
      
      if (hasFilters) {
        setFilters(filters);
        
        const matchingLaptops = laptops.filter(laptop => {
          const matchesBrand = filters.brand ? laptop.brand === filters.brand : true;
          const matchesPrice = laptop.price >= filters.minPrice && laptop.price <= filters.maxPrice;
          return matchesBrand && matchesPrice;
        });

        if (matchingLaptops.length > 0) {
          botResponse = `I've filtered the products to match your criteria. Here are the matching laptops:\n\n${matchingLaptops.map(laptop => 
            `${laptop.brand} ${laptop.model} - $${laptop.price}\n` +
            `Specs: ${laptop.specs.processor}, ${laptop.specs.ram}, ${laptop.specs.storage}`
          ).join('\n\n')}`;
        } else {
          botResponse = "I couldn't find any laptops matching your criteria. Would you like to try different filters?";
        }
      }

      return botResponse;
    } catch (error) {
      console.error('Error:', error);
      // Fallback to filter-only response if API fails
      const filters = extractFilters(userMessage);
      const hasFilters = filters.brand || filters.minPrice > 0 || filters.maxPrice < 10000;
      
      if (hasFilters) {
        setFilters(filters);
        const matchingLaptops = laptops.filter(laptop => {
          const matchesBrand = filters.brand ? laptop.brand === filters.brand : true;
          const matchesPrice = laptop.price >= filters.minPrice && laptop.price <= filters.maxPrice;
          return matchesBrand && matchesPrice;
        });

        if (matchingLaptops.length > 0) {
          return `Here are the laptops matching your criteria:\n\n${matchingLaptops.map(laptop => 
            `${laptop.brand} ${laptop.model} - $${laptop.price}\n` +
            `Specs: ${laptop.specs.processor}, ${laptop.specs.ram}, ${laptop.specs.storage}`
          ).join('\n\n')}`;
        }
      }
      
      return "I apologize, but I'm having trouble connecting to my language model right now. I can still help you filter laptops based on brand and price range. What are you looking for?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(input);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botResponse,
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h3 className="font-semibold">Product Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-200'
                } p-3 rounded-lg max-w-[80%] whitespace-pre-wrap`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-gray-200 p-3 rounded-lg">
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our laptops..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`bg-blue-600 text-white p-2 rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}