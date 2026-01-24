import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";

// import HomeNavbar from "@/Components/Navber/HomeNavbar";

// Correct font variable names
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// Viewport configuration (separate from metadata in Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "FishingTripper",
  description: "Plan Your Perfect Day on the Water",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FishingTripper",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ToastContainer />
          <ReduxProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
