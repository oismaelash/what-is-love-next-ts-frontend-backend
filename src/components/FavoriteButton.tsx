'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { useFavorites } from '@/context/FavoritesContext';
import { useState } from 'react';

interface FavoriteButtonProps {
  definitionId: string;
}

export default function FavoriteButton({ definitionId }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (isFavorite(definitionId)) {
        await removeFavorite(definitionId);
      } else {
        await addFavorite(definitionId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip title={isFavorite(definitionId) ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
      <IconButton
        onClick={handleClick}
        disabled={isLoading}
        color={isFavorite(definitionId) ? 'primary' : 'default'}
        size="small"
      >
        {isFavorite(definitionId) ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
} 