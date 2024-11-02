import React, { useState } from 'react';
import { Save, History, Trash2, Check } from 'lucide-react';
import { Version, Restaurant } from '../types';

interface Props {
  restaurants: Restaurant[];
  onRestore: (restaurants: Restaurant[]) => void;
}

export function VersionControl({ restaurants, onRestore }: Props) {
  const [versions, setVersions] = useState<Version[]>(() => {
    const saved = localStorage.getItem('restaurant-versions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isNaming, setIsNaming] = useState(false);
  const [versionName, setVersionName] = useState('');

  const saveVersion = (name: string) => {
    const newVersion: Version = {
      id: crypto.randomUUID(),
      name,
      timestamp: Date.now(),
      restaurants,
    };
    
    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    localStorage.setItem('restaurant-versions', JSON.stringify(updatedVersions));
    setIsNaming(false);
    setVersionName('');
  };

  const deleteVersion = (id: string) => {
    const updatedVersions = versions.filter(v => v.id !== id);
    setVersions(updatedVersions);
    localStorage.setItem('restaurant-versions', JSON.stringify(updatedVersions));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          Version Control
        </h2>
        
        {!isNaming ? (
          <button
            onClick={() => setIsNaming(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Current Version
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="Version name..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => saveVersion(versionName || `Version ${versions.length + 1}`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setIsNaming(false);
                setVersionName('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div>
              <h3 className="font-medium">{version.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(version.timestamp).toLocaleString()} • 
                {version.restaurants.length} restaurants
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRestore(version.restaurants)}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
              >
                Restore
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this version?')) {
                    deleteVersion(version.id);
                  }
                }}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {versions.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No saved versions yet. Save your first version to start tracking changes!
          </p>
        )}
      </div>
    </div>
  );
}