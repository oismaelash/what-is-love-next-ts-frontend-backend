'use client';

import { Card, CardContent, Typography, Box, IconButton, Stack, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, Star, Share } from '@mui/icons-material';
import { IDefinition } from '@/models/Definition';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FavoriteButton from './FavoriteButton';
import HighlightButton from './HighlightButton';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import ShareDialog from './ShareDialog';
import { useAnalytics } from '@/hooks/useAnalytics';

interface DefinitionCardProps {
  definition: IDefinition;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function DefinitionCard({ definition, onLike, isLiked }: DefinitionCardProps) {
  const { user } = useAuth();
  const [authorName, setAuthorName] = useState<string>('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { trackEvent } = useAnalytics();
  const isHighlighted = definition.isHighlighted &&
    (!definition.highlightExpiresAt || new Date(definition.highlightExpiresAt) > new Date());

  // Check if author is an ID (starts with ObjectId format) or a name string
  const isAuthorId = /^[0-9a-fA-F]{24}$/.test(definition.author);
  console.log('User:', user);
  console.log('User ID:', user?._id);
  console.log('User ID string:', user?._id?.toString());
  console.log('Definition author:', definition.author);
  console.log('Definition author string:', definition.author.toString());
  console.log('isAuthorId:', isAuthorId);

  // For old definitions (with author name), we'll consider the user as author if they're logged in
  // and their name matches the author name
  const isAuthor = isAuthorId
    ? user?._id?.toString() === definition.author.toString()
    : user?.name === definition.author;

  console.log('isAuthor:', isAuthor);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (isAuthorId) {
        try {
          const response = await fetch(`/api/user/${definition.author}`);
          if (response.ok) {
            const data = await response.json();
            setAuthorName(data.user.name);
          }
        } catch (error) {
          console.error('Error fetching author name:', error);
        }
      } else {
        setAuthorName(definition.author);
      }
    };

    fetchAuthorName();
  }, [definition.author, isAuthorId]);

  const handleLike = () => {
    if (onLike) {
      trackEvent('FAVORITE', 'DEFINITION', `Liked definition ${definition._id}`);
      onLike();
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
    trackEvent('CLICK', 'DEFINITION', `Shared definition ${definition._id}`);
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          border: isHighlighted ? '2px solid #FFD700' : 'none',
          boxShadow: isHighlighted ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none',
          width: '100%',
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {authorName || 'Carregando...'}
            </Typography>
            <Stack direction="row" spacing={1}>
              {isHighlighted && (
                <Chip
                  icon={<Star />}
                  label="Destacada"
                  color="warning"
                  size="small"
                />
              )}
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(definition.createdAt), { locale: ptBR, addSuffix: true })}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body1" paragraph>
            {definition.content}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={handleLike} size="small">
                {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {definition.likes} curtidas
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {definition.shares} compartilhamentos
              </Typography>
              <IconButton onClick={handleShare} size="small">
                <Share />
              </IconButton>
              <FavoriteButton
                definitionId={definition._id.toString()}
                onFavorite={() => trackEvent('FAVORITE', 'DEFINITION', `Added to favorites ${definition._id}`)}
                onUnfavorite={() => trackEvent('FAVORITE', 'DEFINITION', `Removed from favorites ${definition._id}`)}
              />
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
            {isAuthor && <HighlightButton definitionId={definition._id.toString()} isAuthor={isAuthor} />}
          </Box>
        </CardContent>
      </Card>
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        definitionId={definition._id.toString()}
      />
    </>
  );
} 