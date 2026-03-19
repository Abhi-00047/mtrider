import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import GlobalErrorBoundary from '@/components/ErrorBoundary';
import AuthGuard from '@/components/AuthGuard';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ui',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'MT Rider — Daily Discipline',
  description: 'Yamaha MT-15 themed luxury daily discipline and maintenance tracker.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'MT Rider — Daily Discipline',
    description: 'Yamaha MT-15 themed luxury daily discipline and maintenance tracker.',
    siteName: 'MT Rider',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MT Rider — Daily Discipline',
    description: 'Yamaha MT-15 themed luxury daily discipline and maintenance tracker.',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MT Rider',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#05050a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <GlobalErrorBoundary>
          <AuthGuard>
            {children}
          </AuthGuard>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}