import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const clashDisplay = localFont({
  src: [
    {
      path: '../fonts/ClashDisplay-Variable.woff2',
      weight: '200 700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Museum Lockers Atlas',
  description: 'Interactive locker wall for Dutch museums',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clashDisplay.className}>{children}</body>
    </html>
  );
}
