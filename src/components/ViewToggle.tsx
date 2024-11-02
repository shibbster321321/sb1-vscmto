import React from 'react';
import { List, Map } from 'lucide-react';
import { ViewMode } from '../types';

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: Props) {
  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4">
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-pink-100 text-pink-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <List className="w-5 h-5" />
        List View
      </button>
      <button
        onClick={() => onViewModeChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'map'
            ? 'bg-pink-100 text-pink-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Map className="w-5 h-5" />
        Map View
      </button>
    </div>
  );
}