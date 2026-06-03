import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { BRAND_LOGO_URL } from "@/constant/brand.constants";
// import { Geist, Geist_Mono } from "next/font/google";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import Loader from "@/components/ui/Loader";
import "./globals.css";

// Viewport configuration (separate from metadata in Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "The Fishing Hub",
  description: "Plan Your Perfect Day on the Water",
  icons: {
    icon: [{ url: BRAND_LOGO_URL, type: "image/png" }],
    apple: [{ url: BRAND_LOGO_URL, type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Fishing Hub",
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
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
