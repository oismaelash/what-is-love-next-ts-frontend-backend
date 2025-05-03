import DefinitionForm from '../components/DefinitionForm';
import { Button, Box, Typography, Container } from '@mui/material';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';

export default function Home() {
  return (
    <main>
      <Container sx={{ gap: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" align="center" color="text.secondary">
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
              py: 1,
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
