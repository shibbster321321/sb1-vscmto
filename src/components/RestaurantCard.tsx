import React from 'react';
import { Star, DollarSign, Clock } from 'lucide-react';
import { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: Props) {
  const formattedDate = new Date(restaurant.timestamp).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
        <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
          {restaurant.cuisine}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{restaurant.description}</p>
      
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span>{restaurant.rating}/5</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-green-600 mr-1" />
          <span>{restaurant.priceRange}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-400 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Recommended by <span className="font-medium text-gray-700">{restaurant.recommendedBy}</span>
        </p>
      </div>
    </div>
  );
}