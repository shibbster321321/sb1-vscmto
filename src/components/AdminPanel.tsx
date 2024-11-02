import React from 'react';
import { Edit2, Trash2, X } from 'lucide-react';
import { Restaurant } from '../types';
import { AddRestaurantForm } from './AddRestaurantForm';

interface Props {
  restaurants: Restaurant[];
  onAdd: (restaurant: Omit<Restaurant, 'id' | 'timestamp'>) => void;
  onUpdate: (id: string, restaurant: Omit<Restaurant, 'id' | 'timestamp'>) => void;
  onDelete: (id: string) => void;
}

export function AdminPanel({ restaurants, onAdd, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Restaurant</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
        <AddRestaurantForm onAdd={onAdd} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Restaurants</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Cuisine</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rating</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{restaurant.name}</td>
                  <td className="px-4 py-2">{restaurant.cuisine}</td>
                  <td className="px-4 py-2">{restaurant.priceRange}</td>
                  <td className="px-4 py-2">{restaurant.rating}/5</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(restaurant.id)}
                        className="p-1 text-pink-600 hover:text-pink-800"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this restaurant?')) {
                            onDelete(restaurant.id);
                          }
                        }}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Restaurant</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <AddRestaurantForm
                onAdd={(data) => {
                  onUpdate(editingId, data);
                  setEditingId(null);
                }}
                initialData={restaurants.find((r) => r.id === editingId)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}