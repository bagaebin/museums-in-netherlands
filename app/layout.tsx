import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Museum Lockers Atlas',
  description: 'Interactive locker wall for museums in the Netherlands',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
