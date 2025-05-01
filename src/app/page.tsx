import Image from "next/image";
import DefinitionForm from './components/DefinitionForm';
import { Button, Box, Typography, Container } from '@mui/material';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';

export default function Home() {
  return (
    <main>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          O Que é Amor?
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Compartilhe sua definição de amor e inspire outras pessoas
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            component={Link}
            href="/definicoes-destaque"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<StarIcon />}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            Ver Definições em Destaque
          </Button>
        </Box>

        <DefinitionForm />
      </Container>
    </main>
  );
}
