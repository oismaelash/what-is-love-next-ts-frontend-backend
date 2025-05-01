import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Definição Não Encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A definição que você está procurando não existe ou foi removida.
        </Typography>
        <Button 
          component={Link} 
          href="/" 
          variant="contained" 
          color="primary"
        >
          Voltar para a página inicial
        </Button>
      </Box>
    </Container>
  );
} 