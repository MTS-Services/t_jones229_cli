"use client";

import { useState } from "react";

const content = [
  {
    line1: "Plan Your Perfect Day on the Water",
    desc: "Find the best fishing charters, expert captains, and unforgettable adventures—tailored to you. Join a group fishing charter or hire a private boat.",
    colorClass: "from-blue-300 to-cyan-500",
  },
];

export default function Hero() {
  const [index] = useState(0);
  const item = content[index];

  return (
    /* FIXED: Adjusted height for mobile (h-[500px]) vs desktop (md:h-[700px]) */
    <div className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
      {/* Background Video */}
      <video
        src="/intro/introVideo.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="absolute inset-0 w-full h-full object-cover transform translate-z-0"
        onLoadStart={(e) => {
          const video = e.currentTarget;
          video.muted = true;
          video.play().catch(() => {
            // Fallback for when autoplay fails
            console.log("Video autoplay failed");
          });
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-8 z-20">
        {/* Heading */}
        <h1 className="text-3xl sm:text-3xl md:text-5xl uppercase font-bold mb-4 md:mb-6 leading-tight max-w-7xl mx-auto text-white">
          {item.line1}
        </h1>

        {/* Description */}
        <p className="max-w-md md:max-w-2xl text-white sm:text-base md:text-lg mb-8 font-light leading-relaxed">
          {item.desc}
        </p>
      </div>
    </div>
  );
}
