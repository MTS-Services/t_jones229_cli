"use client";
import Footer from "@/components/Footer/Footer";
import HomeNavbar from "@/components/Navber/HomeNavbar";
import Navbar from "@/components/Navber/Navbar";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <>
      {pathname === "/" ? <HomeNavbar /> : <Navbar />}
      {/* <HomeNavbar />
      <Navbar /> */}
      <Suspense>{children}</Suspense>
      <Footer />
    </>
  );
}
