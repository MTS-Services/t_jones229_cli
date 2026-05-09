"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const Footer = dynamic(() => import("@/components/Footer/Footer"), {
  ssr: false,
});
const HomeNavbar = dynamic(() => import("@/components/Navber/HomeNavbar"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/Navber/Navbar"), {
  ssr: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>{children}</div>
    );
  }

  // Hide navbar and footer for list-your-boat page
  const hideLayout = pathname === "/list-your-boat";

  if (hideLayout) {
    return <Suspense fallback={null}>{children}</Suspense>;
  }

  return (
    <>
      {pathname === "/" ? <HomeNavbar /> : <Navbar />}

      <Suspense fallback={null}>{children}</Suspense>
      <Footer />
    </>
  );
}
