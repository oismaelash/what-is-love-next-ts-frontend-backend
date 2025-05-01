import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import ThemeRegistry from '@/components/ThemeRegistry';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box } from '@mui/material';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "O Que é Amor",
  description: "Compartilhe sua definição de amor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
        style={{ overflow: 'hidden' }}
      >
        <ThemeRegistry>
          <AuthProvider>
            <FavoritesProvider>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100vh',
                  overflow: 'hidden',
                }}
              >
                <Header />
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'auto',
                  }}
                >
                  {children}
                </Box>
                <Footer />
              </Box>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
