"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// Dynamic imports to prevent iOS Safari crashes
const Footer = dynamic(() => import("@/components/Footer/Footer"), { ssr: false });
const HomeNavbar = dynamic(() => import("@/components/Navber/HomeNavbar"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navber/Navbar"), { ssr: false });

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        {children}
      </div>
    );
  }

  return (
    <>
      {pathname === "/" ? <HomeNavbar /> : <Navbar />}
      <Suspense>{children}</Suspense>
      <Footer />
    </>
  );
}
