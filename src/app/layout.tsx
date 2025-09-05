import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import AuthProvider from '@/context/AuthProvider';
import  {authOptions}  from '@/app/api/auth/[...nextauth]/options';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FeedbackLoop',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" >
      {/* <AuthProvider> */}
        <body className={inter.className}>
        <AuthProvider>

          {children}
        <Toaster richColors />
          </AuthProvider>
        
        </body>
      {/* </AuthProvider> */}
    </html>
  );
}
