import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { APP_NAME } from '@/lib/constants';
import { Toaster } from '@/components/ui/toaster';

const geistSans = GeistSans; // Use directly if imported correctly
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: APP_NAME,
  description: `Manage your car leases efficiently with ${APP_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
