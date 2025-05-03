import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import ThemeRegistry from '@/components/ThemeRegistry';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';

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
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeRegistry>
          <AuthProvider>
            <FavoritesProvider>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  position: 'relative',
                }}
              >
                <Header />
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: '60px',
                    // paddingTop: { xs: '44px', sm: '64px' },
                  }}
                >
                  {children}
                </Box>
                <Footer />
              </Box>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeRegistry>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
