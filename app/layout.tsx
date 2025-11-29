import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netherlands Museum Lockers",
  description: "Interactive locker wall of Dutch museums",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
