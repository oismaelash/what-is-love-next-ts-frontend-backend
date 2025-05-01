import { Card, CardContent, Typography, Box, IconButton, Stack } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { IDefinition } from '@/models/Definition';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FavoriteButton from './FavoriteButton';

interface DefinitionCardProps {
  definition: IDefinition;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function DefinitionCard({ definition, onLike, isLiked = false }: DefinitionCardProps) {
  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2,
            fontStyle: 'italic',
            color: 'text.secondary'
          }}
        >
          "{definition.content}"
        </Typography>
        
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography 
            variant="caption" 
            color="text.secondary"
          >
            Por {definition.author}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
            >
              {formatDistanceToNow(new Date(definition.createdAt), {
                addSuffix: true,
                locale: ptBR
              })}
            </Typography>
            
            <IconButton 
              size="small" 
              onClick={onLike}
              color={isLiked ? 'primary' : 'default'}
            >
              {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            
            <Typography 
              variant="caption" 
              color="text.secondary"
            >
              {definition.likes}
            </Typography>

            <FavoriteButton definitionId={definition._id.toString()} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
} 