import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5C8D', // Rosa médio para botões principais
      light: '#FDB5C0', // Rosa claro para ações secundárias
      dark: '#FF3E6C', // Vermelho rosado para ícones
    },
    background: {
      default: '#FFF8F5', // Off-white quente para fundo principal
      paper: '#FFFFFF', // Branco para cards e elementos de superfície
    },
    text: {
      primary: '#333333', // Cinza escuro para textos principais
      secondary: '#666666', // Cinza médio para textos secundários
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Rubik',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Remove uppercase transformation from buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme; 