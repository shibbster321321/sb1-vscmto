export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  rating: 1 | 2 | 3 | 4 | 5;
  recommendedBy: string;
  timestamp: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export type CuisineType = 'All' | 'Italian' | 'Japanese' | 'Mexican' | 'Indian' | 'American' | 'French' | 'Thai' | 'Other';

export type ViewMode = 'list' | 'map' | 'both';