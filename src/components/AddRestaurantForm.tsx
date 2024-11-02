import React, { useState } from 'react';
import { PlusCircle, MapPin, Loader2, ChevronUp } from 'lucide-react';
import { Restaurant, CuisineType } from '../types';

interface Props {
  onAdd: (restaurant: Omit<Restaurant, 'id' | 'timestamp'>) => void;
  initialData?: Restaurant;
}

export function AddRestaurantForm({ onAdd, initialData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialData ? { lat: initialData.location.lat, lng: initialData.location.lng } : null
  );
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  
  const geocodeAddress = async (address: string) => {
    setIsGeocoding(true);
    setGeocodingError(null);
    
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }
      
      setCoordinates({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      });
    } catch (error) {
      setGeocodingError('Could not find coordinates for this address. Please try again or enter coordinates manually.');
      setCoordinates(null);
    } finally {
      setIsGeocoding(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onAdd({
      name: formData.get('name') as string,
      cuisine: formData.get('cuisine') as CuisineType,
      description: formData.get('description') as string,
      priceRange: formData.get('priceRange') as Restaurant['priceRange'],
      rating: Number(formData.get('rating')) as Restaurant['rating'],
      recommendedBy: formData.get('recommendedBy') as string,
      location: {
        lat: coordinates?.lat ?? Number(formData.get('lat')),
        lng: coordinates?.lng ?? Number(formData.get('lng')),
        address: formData.get('address') as string,
      },
    });
    
    setIsOpen(false);
    setCoordinates(null);
    e.currentTarget.reset();
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        {isOpen ? (
          <>
            <ChevronUp className="w-5 h-5" />
            Hide Form
          </>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" />
            Add Restaurant
          </>
        )}
      </button>

      {isOpen && (
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  required
                  name="name"
                  defaultValue={initialData?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine Type
                </label>
                <select
                  required
                  name="cuisine"
                  defaultValue={initialData?.cuisine}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="French">French</option>
                  <option value="Thai">Thai</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  defaultValue={initialData?.description}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline-block mr-1" />
                  Address
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    name="address"
                    defaultValue={initialData?.location.address}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Full street address"
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        setGeocodingError(null);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.form?.querySelector('[name="address"]') as HTMLInputElement;
                      if (input.value) {
                        geocodeAddress(input.value);
                      }
                    }}
                    disabled={isGeocoding}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isGeocoding ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Find Coordinates'
                    )}
                  </button>
                </div>
                {geocodingError && (
                  <p className="mt-1 text-sm text-red-600">{geocodingError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  name="lat"
                  value={coordinates?.lat ?? initialData?.location.lat ?? ''}
                  onChange={(e) => 
                    setCoordinates(prev => ({
                      ...prev,
                      lat: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  name="lng"
                  value={coordinates?.lng ?? initialData?.location.lng ?? ''}
                  onChange={(e) => 
                    setCoordinates(prev => ({
                      ...prev,
                      lng: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., -74.0060"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  required
                  name="priceRange"
                  defaultValue={initialData?.priceRange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="€">€ (Budget)</option>
                  <option value="€€">€€ (Moderate)</option>
                  <option value="€€€">€€€ (Expensive)</option>
                  <option value="€€€€">€€€€ (Luxury)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  required
                  name="rating"
                  defaultValue={initialData?.rating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  required
                  name="recommendedBy"
                  defaultValue={initialData?.recommendedBy}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setCoordinates(null);
                  setGeocodingError(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}