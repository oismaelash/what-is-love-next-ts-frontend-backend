'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IComment } from '@/models/Comment';

interface CommentProps {
  comment: IComment;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <Card sx={{ mb: 1, width: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {comment.author}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(comment.createdAt), { locale: ptBR, addSuffix: true })}
          </Typography>
        </Box>
        <Typography variant="body2">
          {comment.content}
        </Typography>
      </CardContent>
    </Card>
  );
} 