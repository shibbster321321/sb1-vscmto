import React, { useState, useMemo, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { Restaurant, CuisineType, ViewMode } from './types';
import { RestaurantCard } from './components/RestaurantCard';
import { AddRestaurantForm } from './components/AddRestaurantForm';
import { FilterBar } from './components/FilterBar';
import { MapView } from './components/MapView';
import { ViewToggle } from './components/ViewToggle';

// Use environment variable with fallback for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      // Try primary API first
      try {
        const response = await fetch(`${API_URL}/restaurants`);
        if (!response.ok) throw new Error('Primary API failed');
        const data = await response.json();
        setRestaurants(data);
        setError(null);
        return;
      } catch (primaryError) {
        console.log('Primary API error:', primaryError);
      }

      // Try localhost as fallback
      try {
        const response = await fetch('http://localhost:3000/api/restaurants');
        if (!response.ok) throw new Error('Fallback API failed');
        const data = await response.json();
        setRestaurants(data);
        setError(null);
      } catch (fallbackError) {
        console.log('Fallback API error:', fallbackError);
        throw new Error('All API endpoints failed');
      }
    } catch (err) {
      setError('Failed to load restaurants. Please try again later.');
      // Try to load from localStorage as last resort
      const savedData = localStorage.getItem('restaurants');
      if (savedData) {
        setRestaurants(JSON.parse(savedData));
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurant = async (newRestaurant: Omit<Restaurant, 'id' | 'timestamp'>) => {
    try {
      const restaurantData = {
        ...newRestaurant,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      });

      if (!response.ok) throw new Error('Failed to add restaurant');
      
      await fetchRestaurants();
      setError(null);
    } catch (err) {
      setError('Failed to add restaurant. Please try again.');
      console.error('Error adding restaurant:', err);
    }
  };

  const filteredAndSortedRestaurants = useMemo(() => {
    return restaurants
      .filter((restaurant) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
        const matchesPrice = priceFilter === 'all' || restaurant.priceRange === priceFilter;
        return matchesSearch && matchesCuisine && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.timestamp - a.timestamp;
          case 'oldest':
            return a.timestamp - b.timestamp;
          case 'rating':
            return b.rating - a.rating;
          case 'price-asc':
            return a.priceRange.length - b.priceRange.length;
          case 'price-desc':
            return b.priceRange.length - a.priceRange.length;
          default:
            return 0;
        }
      });
  }, [restaurants, searchTerm, selectedCuisine, priceFilter, sortBy]);

  // Save to localStorage whenever restaurants change
  useEffect(() => {
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Utensils className="w-8 h-8 text-pink-600" />
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Wall</h1>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Find a Vegan Restaurant near you
          </h2>
          <p className="text-xl text-gray-600">
            Add any restaurant suggestions that you have
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <AddRestaurantForm onAdd={handleAddRestaurant} />
        
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCuisine={selectedCuisine}
          onCuisineChange={setSelectedCuisine}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <ViewToggle viewMode="both" onViewModeChange={() => {}} />
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading restaurants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {filteredAndSortedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
              
              {filteredAndSortedRestaurants.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {restaurants.length === 0
                      ? "No restaurants added yet. Be the first to recommend one!"
                      : "No restaurants match your filters."}
                  </p>
                </div>
              )}
            </div>
            
            <div className="h-[calc(100vh-20rem)] sticky top-6">
              <MapView
                restaurants={filteredAndSortedRestaurants}
                selectedRestaurant={selectedRestaurant}
                onRestaurantSelect={setSelectedRestaurant}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}