import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MT Rider — Daily Discipline Tracker',
  description: 'Yamaha MT-15 themed daily discipline tracker',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#05050a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}