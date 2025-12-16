import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import ReduxProvider from '@/redux/provider/ReduxProvider';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Suspense } from 'react';

// import HomeNavbar from "@/Components/Navber/HomeNavbar";

// Correct font variable names
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Fishing-Tripper',
  description: 'Plan Your Perfect Day on the Water',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fishing-Tripper',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased' suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ToastContainer />
          <ReduxProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
