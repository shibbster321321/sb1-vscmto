import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../types';

interface Props {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValidCredentials = ADMIN_CREDENTIALS.some(
      admin => admin.username === username && admin.password === password
    );

    if (isValidCredentials) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onLogin();
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        
        <form onSubmit={handleLogin}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p>Username: demo</p>
            <p>Password: demo123</p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}