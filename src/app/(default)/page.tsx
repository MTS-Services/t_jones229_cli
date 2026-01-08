"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import components with no SSR to prevent iOS Safari crashes
const Hero = dynamic(() => import("@/components/Home/Hero"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "400px", background: "#1a1a1a" }} />,
});

const SearchBar = dynamic(() => import("@/components/Home/SearchBar"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100px" }} />,
});

const WellComeVideo = dynamic(() => import("@/components/Home/WellComeVideo"), {
  ssr: false,
});

const SearchDestinations = dynamic(
  () => import("@/components/Home/SearchDestinations"),
  {
    ssr: false,
  }
);

const Experience = dynamic(() => import("@/components/Home/Experience"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      {/* <Suspense fallback={<div style={{ minHeight: "100px" }} />}>
        <SearchBar />
      </Suspense> */}
      <Suspense
        fallback={<div style={{ minHeight: "400px", background: "#1a1a1a" }} />}
      >
        <Hero />
      </Suspense>
      <WellComeVideo />
      <SearchDestinations />
      <Experience />
      {/* <TopCharters /> */}
    </div>
  );
}
