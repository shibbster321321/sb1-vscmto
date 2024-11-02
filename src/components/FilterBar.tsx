import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CuisineType } from '../types';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCuisine: CuisineType;
  onCuisineChange: (cuisine: CuisineType) => void;
  priceFilter: string;
  onPriceFilterChange: (price: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCuisine,
  onCuisineChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortChange,
}: Props) {
  const selectClass = "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500";
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCuisine}
              onChange={(e) => onCuisineChange(e.target.value as CuisineType)}
              className={selectClass}
            >
              <option value="All">All Cuisines</option>
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
          
          <select
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All Prices</option>
            <option value="€">€ (Budget)</option>
            <option value="€€">€€ (Moderate)</option>
            <option value="€€€">€€€ (Expensive)</option>
            <option value="€€€€">€€€€ (Luxury)</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClass}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}