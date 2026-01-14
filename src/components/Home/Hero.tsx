"use client";

import { useState } from "react";
import Button from "../ReUsible/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const content = [
  {
    line1: "Plan Your Perfect Day on the Water",
    desc: "Find the best fishing charters, expert captains, and unforgettable adventures—tailored to you. Join a group fishing charter or hire a private boat.",
    colorClass: "from-blue-300 to-cyan-500",
  },
];

export default function Hero() {
  const [index] = useState(0);
  const router = useRouter();

  const isLoggedIn = false;

  const handleNavigation = () => {
    const targetPath = "/dashboard/check-your-trip";

    if (isLoggedIn) {
      router.push(targetPath);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  const item = content[index];

  return (
    <div className="relative w-full h-[700px] overflow-hidden bg-black">
      {/* Background Video */}
      <video
        src="/intro/introVideo.mp4"
        poster="/intro/introPoster.jpg"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-contain md:object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto text-white">
          <span className={``}>{item.line1}</span>
        </h1>

        {/* Description */}
        <p className="max-w-xl text-white text-base md:text-lg mb-10 font-light leading-relaxed">
          {item.desc}
        </p>
      </div>
    </div>
  );
}
