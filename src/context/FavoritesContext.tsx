'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Set<string>;
  addFavorite: (definitionId: string) => Promise<void>;
  removeFavorite: (definitionId: string) => Promise<void>;
  isFavorite: (definitionId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Load favorites on mount and when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/favorites', {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            setFavorites(new Set(data.favorites));
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      } else {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(new Set(JSON.parse(storedFavorites)));
        }
      }
    };

    loadFavorites();
  }, [user]);

  const addFavorite = async (definitionId: string) => {
    try {
      if (user) {
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ definitionId }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }
      }

      const newFavorites = new Set(favorites).add(definitionId);
      setFavorites(newFavorites);

      if (!user) {
        localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (definitionId: string) => {
    try {
      if (user) {
        const response = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ definitionId }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to remove favorite');
        }
      }

      const newFavorites = new Set(favorites);
      newFavorites.delete(definitionId);
      setFavorites(newFavorites);

      if (!user) {
        localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (definitionId: string) => {
    return favorites.has(definitionId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
